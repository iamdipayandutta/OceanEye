# INCOIS — Crowdsourced Ocean Hazard Platform

> Unified platform for citizen reporting and social-media sensing to support INCOIS early-warning and situational awareness.

---

## 1. Executive Summary

This document describes the recommended approach, system architecture, phased roadmap, implementation strategy, and a suggested technology stack for a crowdsourced ocean hazard reporting and analytics platform. The platform enables geotagged citizen reports (photos/videos/text), aggregates social media signals, and provides a map-based dashboard and API integration with INCOIS early-warning systems.

---

## 2. Goals & Scope (MVP)
- Enable citizens to submit geotagged reports (photo/video/text) via mobile and web apps.
- Aggregate and display live crowd reports on an interactive map with filters.
- Ingest social media streams, run NLP to extract hazard-related posts, and visualize trends.
- Implement role-based access (citizens, officials, analysts) and offline reporting.
- Pilot the system in 1–2 coastal cities (e.g., Chennai, Visakhapatnam).

---

## 3. Functional Requirements
- **User registration & authentication** (email/phone + optional OTP).  
- **Report submission**: category, timestamp, automatic geotag, media upload (image/video), short description, optional severity rating.  
- **Offline-first upload**: locally store reports and sync when online.  
- **Map dashboard**: clustered pins, heatmaps, filters (date, hazard type, verification).  
- **Moderation & verification**: curator/official review flows; verified flag.
- **Social media ingestion**: configurable keywords, geolocation heuristics, language detection.
- **NLP & analytics**: hazard classification, sentiment, trending keywords, topic clusters, event detection.  
- **APIs**: REST for data ingest and retrieval; webhook for INCOIS alerts and third-party integration.
- **Multilingual support**: at minimum English + regional languages (Tamil, Telugu, Malayalam, Bengali, Hindi).

---

## 4. Non-Functional Requirements
- Scalability: support burst traffic during events.  
- Low latency for dashboard updates (near real-time).  
- Security & privacy: PII minimization, media moderation, access controls.  
- Reliability: offline caching, retries for uploads.  
- Maintainability: modular microservice architecture.

---

## 5. High-Level System Architecture

```
[Mobile App / Web App] <--> [API Gateway] --> [Auth Service]
                                   |--> [Reporting Service] --> [Postgres+PostGIS]
                                   |--> [Media Service] --> [Object Storage]
                                   |--> [Ingestion Service] --> [Social Media Queue]
                                   |--> [NLP Service] --> [Analytics DB / ElasticSearch]
                                   |--> [Hotspot Engine] --> [Notification Service]
                                   |--> [INCOIS Connector]

[Dashboard] <--> [API Gateway] <--> [Analytics DB / Map Tiles]
```

Key components:
- **Frontend** (mobile + web) — submit reports, view dashboards.  
- **API Gateway & Auth** — JWT / OAuth2, role-based access.  
- **Reporting Service** — handles ingestion, validation, geoprocessing.  
- **Media Service** — stores photos/videos in S3-compatible storage, generates thumbnails, stores metadata.  
- **NLP Pipeline** — stream processing for social media and report text (classification, sentiment, language detection).  
- **Analytics & Hotspot Engine** — spatio-temporal clustering (DBSCAN / ST-DBSCAN), density heatmaps, thresholds for alerts.  
- **Integration Layer** — connectors/webhooks to INCOIS, local authorities, data export.

---

## 6. Data Model (simplified)

```sql
TABLE users (id, name, auth_id, role, phone, language_pref, created_at)
TABLE reports (id, user_id, lat, lon, category, severity, text, media_id, verified, status, created_at)
TABLE media (id, report_id, s3_key, thumb_key, mime_type, size, created_at)
TABLE social_posts (id, source, text, lat, lon, detected_lang, classification, sentiment, created_at)
TABLE hotspots (id, geom, start_ts, end_ts, score, report_count)
```

---

## 7. NLP & Social Media Strategy
- **Sources**: Twitter/X (official API), YouTube comments (via API), public Facebook pages (where allowed), Telegram channels (public), RSS from local news.  
- **Preprocessing**: deduplication, language detection, transliteration (Indic languages), tokenization.  
- **Models**: fine-tuned transformer models (Multilingual BERT / IndicBERT / XLM-RoBERTa) for:  
  - Binary hazard vs non-hazard classification.  
  - Multi-label classification for hazard type (flood, high-wave, unusual tide, debris).  
  - Sentiment analysis (panic/concern/neutral).  
- **Geo-locating social posts**: use explicit geotags, user profile location heuristics, and NER on content (place names).  
- **Streaming & orchestration**: Kafka / PubSub for social ingestion; Spark / Flink for heavy processing; lightweight services for near-real-time classification.

---

## 8. Hotspot Detection & Alerting
- **Spatial clustering**: DBSCAN or ST-DBSCAN on recent reports (time-windowed).  
- **Weighting**: verified reports > unverified; social post surge multiplier; sensor/model corroboration adds confidence.  
- **Alert rules**: customizable thresholds per region; auto-escalate to INCOIS when confidence > threshold.  
- **Visualization**: heatmap tiles, cluster summaries with sample media and score.

---

## 9. UI / UX Considerations
- Simple 1–2 tap reporting flow; default to auto-geotag; allow category pick (or let NLP infer).  
- Media size limits and auto-compression.  
- Provide feedback to the reporter ("Report received / Under review / Verified").  
- Dashboard for officials: filters, export CSV, timeline playback of incident progression.

---

## 10. Tech Stack Recommendations

**Frontend**
- Mobile: **Flutter** (single codebase iOS/Android) — supports offline caching.  
- Web: **React** + TypeScript, **Leaflet.js** or **Mapbox GL JS** for maps.

**Backend & Data**
- API: **Node.js (Express/NestJS)** or **Django REST Framework**.  
- DB: **PostgreSQL** + **PostGIS** for spatial queries.  
- Search & Analytics: **Elasticsearch** (or OpenSearch) for full-text and fast aggregations.  
- Object Storage: **S3** or MinIO (self-hosted).  
- Messaging: **Kafka** or cloud Pub/Sub (for social ingestion & NLP pipeline).  
- Stream processing: **Apache Flink** / **Spark Streaming** (if needed).

**NLP & ML**
- Pretrained models: **IndicBERT** / **mBERT** / **XLM-R**.  
- Training/Serving: **Hugging Face Transformers**, containerized with **TorchServe** or **TF-Serving**, or use **Vertex AI / SageMaker**.  
- Lightweight near-edge inference: **ONNX** conversions / quantized models.  

**Infrastructure**
- Cloud: AWS / GCP / Azure (use managed DB, object storage, pub/sub).  
- Containerization: **Docker**, orchestration with **Kubernetes** (or managed EKS/GKE/AKS) for scale.  
- Monitoring: **Prometheus + Grafana**, centralized logging with **ELK stack**.

**DevOps / CI**
- CI: GitHub Actions / GitLab CI.  
- IaC: Terraform / CloudFormation.  

---

## 11. Privacy, Security & Ethics
- **PII minimization**: avoid storing unnecessary personal info; allow opt-out.  
- **Media moderation**: auto-scan for explicit or irrelevant content; manual override.  
- **Rate limiting & abuse mitigation**: prevent spam floods by reputation & throttling.  
- **Data governance**: retention policies, audit logs, and export controls.

---

## 12. Pilot Plan & Metrics
**Pilot (3 months)**
- Geography: 1–2 coastal cities.  
- Partners: local fishing communities, municipal corporation, INCOIS liaison.  
- Goals: 1) 1,000 user signups; 2) 500 reports; 3) successful correlation of 10 events with INCOIS alerts.

**Success Metrics**
- Report submission rate (per week), verified reports ratio, time-to-verify, hotspot precision/recall vs ground truth, social signal precision for hazard detection.

---

## 13. Integration with INCOIS
- Provide **webhook endpoints** for INCOIS to push model outputs and receive consolidated crowdsourced intelligence.  
- Design a **data-sharing schema** (GeoJSON events, confidence score, media links) and SLAs for escalation.

---

## 14. Roadmap (12 months)
1. **Months 0–3**: MVP mobile + minimal dashboard; social ingestion basic pipeline; pilot prep.  
2. **Months 4–6**: Pilot launch; NLP model improvement; hotspot engine.  
3. **Months 7–9**: Integration with INCOIS; verification workflows; multilingual support.  
4. **Months 10–12**: Scale-out, ops hardening, UX improvements, add advanced analytics.

---

## 15. Appendix — Sample API Endpoints (REST)
- `POST /api/v1/reports` — submit a report (body: user_id, lat, lon, category, text, media multipart).  
- `GET /api/v1/reports?bbox=...&from=...&to=...` — query reports by bounding box and time.  
- `GET /api/v1/hotspots?region_id=...` — list active hotspots.  
- `POST /api/v1/webhook/incois` — INCOIS integration endpoint for alerts (signed payload).

---

*Prepared for: INCOIS / Coastal Disaster Management teams — initial architecture and technology recommendations for a crowdsourced ocean hazard platform.*

