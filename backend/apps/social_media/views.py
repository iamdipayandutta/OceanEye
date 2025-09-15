from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Q, Avg
from .models import SocialMediaPost, MonitoringKeyword, SocialMediaAlert, SocialMediaPlatform
from .serializers import SocialMediaPostSerializer, MonitoringKeywordSerializer, SocialMediaAlertSerializer
import json
import random
import time

class SocialMediaPostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing social media posts
    """
    queryset = SocialMediaPost.objects.all()
    serializer_class = SocialMediaPostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by platform
        platform = self.request.query_params.get('platform')
        if platform:
            queryset = queryset.filter(platform__name=platform)
        
        # Filter by date range
        days = self.request.query_params.get('days', 7)
        start_date = timezone.now() - timedelta(days=int(days))
        queryset = queryset.filter(posted_at__gte=start_date)
        
        # Filter by relevance score
        min_relevance = self.request.query_params.get('min_relevance', 0.5)
        queryset = queryset.filter(relevance_score__gte=float(min_relevance))
        
        return queryset.order_by('-posted_at')

@api_view(['GET'])
@permission_classes([AllowAny])
def get_realtime_hashtags(request):
    """
    Get real-time hashtag data for ocean hazards
    """
    try:
        # Get time range
        hours = int(request.GET.get('hours', 24))
        start_time = timezone.now() - timedelta(hours=hours)
        
        # Get trending keywords with recent activity
        trending_keywords = MonitoringKeyword.objects.filter(
            is_active=True
        ).order_by('-priority')[:10]
        
        # Get recent posts with hashtags
        recent_posts = SocialMediaPost.objects.filter(
            posted_at__gte=start_time,
            relevance_score__gte=0.3
        ).order_by('-posted_at')[:50]
        
        # Simulate real-time hashtag data (replace with actual API calls)
        hashtag_data = []
        
        for keyword in trending_keywords:
            # Get posts containing this keyword
            keyword_posts = recent_posts.filter(
                Q(content__icontains=keyword.keyword) |
                Q(keywords__icontains=keyword.keyword)
            )
            
            # Calculate metrics
            post_count = keyword_posts.count()
            avg_sentiment = keyword_posts.aggregate(
                avg_sentiment=Avg('confidence_score')
            )['avg_sentiment'] or 0
            
            # Get latest posts for this hashtag
            latest_posts = []
            for post in keyword_posts[:3]:
                latest_posts.append({
                    'id': post.id,
                    'content': post.content[:100] + '...' if len(post.content) > 100 else post.content,
                    'author': post.author_username,
                    'platform': post.platform.name,
                    'posted_at': post.posted_at.isoformat(),
                    'likes': post.likes_count,
                    'shares': post.shares_count,
                    'sentiment': post.sentiment,
                    'confidence': float(post.confidence_score),
                    'location': post.location_name or 'Unknown'
                })
            
            hashtag_data.append({
                'keyword': keyword.keyword,
                'hashtag': f"#{keyword.keyword}",
                'priority': keyword.priority,
                'language': keyword.language,
                'post_count': post_count,
                'avg_sentiment': float(avg_sentiment),
                'trend_direction': 'up' if post_count > 5 else 'stable' if post_count > 2 else 'down',
                'related_hazard': keyword.related_hazard_type.name if keyword.related_hazard_type else 'General',
                'latest_posts': latest_posts,
                'last_updated': timezone.now().isoformat()
            })
        
        # Add live simulation data for demonstration
        simulation_hashtags = generate_demo_hashtag_data()
        
        response_data = {
            'status': 'success',
            'timestamp': timezone.now().isoformat(),
            'total_hashtags': len(hashtag_data),
            'real_data': hashtag_data,
            'demo_data': simulation_hashtags,
            'meta': {
                'time_range_hours': hours,
                'total_recent_posts': recent_posts.count(),
                'active_keywords': trending_keywords.count()
            }
        }
        
        return Response(response_data)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e),
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_hashtag_analytics(request):
    """
    Get hashtag analytics and trends
    """
    try:
        # Get time range
        days = int(request.GET.get('days', 7))
        start_date = timezone.now() - timedelta(days=days)
        
        # Get hashtag trends over time
        hashtag_trends = []
        
        # Get active keywords
        keywords = MonitoringKeyword.objects.filter(is_active=True)
        
        for keyword in keywords[:5]:  # Top 5 keywords
            daily_counts = []
            
            # Get daily post counts for the last week
            for i in range(days):
                day_start = start_date + timedelta(days=i)
                day_end = day_start + timedelta(days=1)
                
                day_posts = SocialMediaPost.objects.filter(
                    posted_at__range=[day_start, day_end],
                    content__icontains=keyword.keyword
                ).count()
                
                daily_counts.append({
                    'date': day_start.strftime('%Y-%m-%d'),
                    'count': day_posts
                })
            
            hashtag_trends.append({
                'hashtag': f"#{keyword.keyword}",
                'priority': keyword.priority,
                'daily_data': daily_counts,
                'total_mentions': sum(day['count'] for day in daily_counts)
            })
        
        # Get platform distribution
        platform_stats = []
        platforms = SocialMediaPlatform.objects.filter(is_active=True)
        
        for platform in platforms:
            recent_posts = SocialMediaPost.objects.filter(
                platform=platform,
                posted_at__gte=start_date
            ).count()
            
            platform_stats.append({
                'platform': platform.name,
                'post_count': recent_posts,
                'percentage': 0  # Calculate percentage later
            })
        
        # Calculate percentages
        total_posts = sum(p['post_count'] for p in platform_stats)
        if total_posts > 0:
            for platform in platform_stats:
                platform['percentage'] = round((platform['post_count'] / total_posts) * 100, 1)
        
        response_data = {
            'status': 'success',
            'timestamp': timezone.now().isoformat(),
            'hashtag_trends': hashtag_trends,
            'platform_distribution': platform_stats,
            'time_range_days': days,
            'total_posts_analyzed': total_posts
        }
        
        return Response(response_data)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e),
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def generate_demo_hashtag_data():
    """
    Generate demo hashtag data for demonstration purposes
    """
    demo_hashtags = [
        '#OceanPollution', '#OilSpill', '#MarineLife', '#CoastalErosion',
        '#PlasticWaste', '#RedTide', '#Tsunami', '#CoralBleaching',
        '#SeaLevelRise', '#OceanAcidification', '#MarineDebris', '#WaterQuality'
    ]
    
    demo_data = []
    
    for hashtag in demo_hashtags:
        # Simulate real-time data
        post_count = random.randint(1, 50)
        sentiment_score = random.uniform(0.1, 0.9)
        
        # Generate sample posts
        sample_posts = []
        for i in range(min(3, post_count)):
            sample_posts.append({
                'id': f"demo_{random.randint(1000, 9999)}",
                'content': f"Demo post about {hashtag} - Ocean hazard detected in coastal area...",
                'author': f"citizen_{random.randint(1, 100)}",
                'platform': random.choice(['Twitter', 'Facebook', 'Instagram']),
                'posted_at': (timezone.now() - timedelta(minutes=random.randint(1, 60))).isoformat(),
                'likes': random.randint(1, 100),
                'shares': random.randint(0, 50),
                'sentiment': random.choice(['positive', 'negative', 'neutral']),
                'confidence': round(random.uniform(0.5, 0.95), 2),
                'location': random.choice(['Bay of Bengal', 'Arabian Sea', 'Indian Ocean', 'Coastal Area'])
            })
        
        demo_data.append({
            'keyword': hashtag.replace('#', ''),
            'hashtag': hashtag,
            'priority': random.randint(1, 5),
            'language': 'en',
            'post_count': post_count,
            'avg_sentiment': round(sentiment_score, 2),
            'trend_direction': random.choice(['up', 'down', 'stable']),
            'related_hazard': random.choice(['Oil Spill', 'Marine Pollution', 'Coastal Erosion', 'Water Quality']),
            'latest_posts': sample_posts,
            'last_updated': timezone.now().isoformat()
        })
    
    return demo_data

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def simulate_hashtag_collection(request):
    """
    Simulate hashtag data collection for testing
    """
    try:
        # Get parameters
        hashtag = request.data.get('hashtag', 'OceanPollution')
        count = int(request.data.get('count', 5))
        
        created_posts = []
        
        # Get or create platform
        platform, _ = SocialMediaPlatform.objects.get_or_create(
            name='Twitter',
            defaults={
                'api_endpoint': 'https://api.twitter.com/2/',
                'is_active': True,
                'rate_limit_per_hour': 1000
            }
        )
        
        # Create sample posts
        for i in range(count):
            post_data = {
                'platform': platform,
                'external_id': f"demo_{random.randint(100000, 999999)}",
                'content': f"Demo post about #{hashtag} - Ocean hazard monitoring in progress. Location: Coastal area #{i+1}",
                'author_username': f"citizen_{random.randint(1, 1000)}",
                'author_followers': random.randint(100, 10000),
                'likes_count': random.randint(1, 500),
                'shares_count': random.randint(0, 100),
                'comments_count': random.randint(0, 50),
                'latitude': round(random.uniform(8.0, 28.0), 6),  # India coastal range
                'longitude': round(random.uniform(68.0, 97.0), 6),
                'location_name': random.choice(['Mumbai Coast', 'Chennai Beach', 'Kolkata Port', 'Kochi Harbor']),
                'sentiment': random.choice(['positive', 'negative', 'neutral']),
                'confidence_score': round(random.uniform(0.5, 0.95), 2),
                'keywords': [hashtag, 'ocean', 'hazard'],
                'language': 'en',
                'is_verified_source': random.choice([True, False]),
                'relevance_score': round(random.uniform(0.3, 0.9), 2),
                'posted_at': timezone.now() - timedelta(minutes=random.randint(1, 120)),
                'collected_at': timezone.now()
            }
            
            # Create post
            post = SocialMediaPost.objects.create(**post_data)
            created_posts.append({
                'id': post.id,
                'content': post.content,
                'hashtag': f"#{hashtag}",
                'location': post.location_name,
                'sentiment': post.sentiment,
                'posted_at': post.posted_at.isoformat()
            })
        
        return Response({
            'status': 'success',
            'message': f'Created {count} demo posts for #{hashtag}',
            'created_posts': created_posts,
            'timestamp': timezone.now().isoformat()
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e),
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)