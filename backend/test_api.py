#!/usr/bin/env python3
"""
API Endpoints Test Script
"""
import urllib.request
import json

def test_api_endpoints():
    print('=== API ENDPOINTS TEST (Live Server) ===')
    
    base_url = 'http://127.0.0.1:8001'
    
    # Test hazard types endpoint
    try:
        with urllib.request.urlopen(f'{base_url}/api/v1/reports/hazard-types/') as response:
            data = json.loads(response.read())
            print(f'✅ Hazard Types API: {response.status} - {len(data)} types found')
            if data:
                print(f'   Sample type: {data[0]["name"]}')
    except Exception as e:
        print(f'❌ Hazard Types API: {str(e)}')
    
    # Test reports endpoint (should require auth but let's see the response)
    try:
        with urllib.request.urlopen(f'{base_url}/api/v1/reports/') as response:
            data = json.loads(response.read())
            print(f'✅ Reports API: {response.status} - Response received')
    except urllib.error.HTTPError as e:
        if e.code == 403:
            print(f'🔒 Reports API: {e.code} (Authentication required - Expected)')
        else:
            print(f'❌ Reports API: {e.code}')
    except Exception as e:
        print(f'❌ Reports API: {str(e)}')
    
    # Test admin panel
    try:
        with urllib.request.urlopen(f'{base_url}/admin/') as response:
            print(f'✅ Admin Panel: {response.status} (Accessible)')
    except urllib.error.HTTPError as e:
        if e.code == 302:  # Redirect to login
            print(f'🔒 Admin Panel: Redirects to login (Expected)')
        else:
            print(f'❌ Admin Panel: {e.code}')
    except Exception as e:
        print(f'❌ Admin Panel: {str(e)}')
    
    print('\n✅ Live API test completed!')

if __name__ == '__main__':
    test_api_endpoints()