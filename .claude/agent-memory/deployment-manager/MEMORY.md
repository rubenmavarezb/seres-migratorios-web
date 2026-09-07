# Deployment Manager - Agent Memory

This file maintains persistent memory for the deployment-manager agent across sessions.

## Purpose
Track deployment history, infrastructure configuration, and deployment patterns for staging and production environments.

## Infrastructure Configuration

### Cloud Provider & Services
<!-- AWS, GCP, Azure, Vercel, Netlify, etc. -->
<!-- Specific services used (EC2, Lambda, Cloud Run, etc.) -->

### Deployment Tools
<!-- kubectl, docker, aws cli, gcloud, vercel cli, terraform, etc. -->
<!-- CI/CD pipeline (GitHub Actions, GitLab CI, Jenkins, CircleCI) -->
<!-- Container registry, artifact storage -->

### Infrastructure as Code
<!-- Terraform, CloudFormation, Pulumi configuration locations -->
<!-- Infrastructure repository links -->

## Environment Details

### Staging Environment
<!-- Access method (URL, SSH, dashboard) -->
<!-- Environment variables location -->
<!-- Secrets management approach -->
<!-- Database connection details -->
<!-- Monitoring dashboard links -->

### Production Environment
<!-- Access method (URL, SSH, dashboard) -->
<!-- Environment variables location -->
<!-- Secrets management approach -->
<!-- Database connection details -->
<!-- Monitoring dashboard links -->
<!-- Load balancer / CDN configuration -->

## Deployment Strategy

### Chosen Strategy
<!-- Blue-green, canary, rolling, recreate -->
<!-- Gradual rollout configuration (percentages, timing) -->
<!-- Automation level (fully automated, semi-automated, manual) -->

### Deployment Process
<!-- Step-by-step deployment commands -->
<!-- Pre-deployment script locations -->
<!-- Post-deployment validation scripts -->

## Deployment History

### Recent Deployments
<!-- Date | Environment | Version | Deployer | Status | Issues -->
<!-- Track last 10-20 deployments -->

### Rollback History
<!-- Date | Environment | Reason | Resolution -->

## Approval & Governance

### Approval Rules
<!-- Who can deploy to staging (automated?) -->
<!-- Who can deploy to production -->
<!-- Required approvals or checks -->

### Change Freeze Periods
<!-- Holidays, critical periods when deployments are restricted -->
<!-- Upcoming freeze periods -->

## Monitoring & Validation

### Health Check Endpoints
<!-- /health, /ready, /live endpoints -->
<!-- Expected responses -->

### Smoke Tests
<!-- Commands or scripts to run -->
<!-- Expected outcomes -->

### Key Metrics to Monitor
<!-- Error rate thresholds -->
<!-- Response time thresholds -->
<!-- Resource usage alerts -->

### Monitoring Dashboards
<!-- Links to Datadog, New Relic, CloudWatch, etc. -->

## Database & Migration Strategy

### Migration Approach
<!-- How migrations are run (automated, manual, blue-green) -->
<!-- Migration reversibility requirements -->
<!-- Migration testing process -->

### Backup & Recovery
<!-- Backup schedule and location -->
<!-- Recovery time objectives (RTO) -->
<!-- Recovery point objectives (RPO) -->

## Incidents & Lessons Learned

### Past Incidents
<!-- Date | Issue | Impact | Root Cause | Prevention -->

### Known Risks
<!-- Current deployment risks and mitigation strategies -->

### Improvements Identified
<!-- Process improvements from postmortems -->

## Secrets & Configuration Management

### Secret Storage
<!-- AWS Secrets Manager, Vault, 1Password, environment variables -->
<!-- How to rotate secrets -->

### Environment Variables
<!-- Where defined (AWS Parameter Store, Vercel dashboard, .env files) -->
<!-- Critical variables to verify before deployment -->

## Dependencies & External Services

### External Dependencies
<!-- APIs, third-party services, CDNs -->
<!-- Required version compatibility -->

### Service Dependencies
<!-- Database, cache, message queue, etc. -->
<!-- Required versions and configurations -->

## Rollback Procedures

### Rollback Commands
<!-- Specific commands to rollback each environment -->
<!-- Expected rollback duration -->

### Rollback Validation
<!-- How to verify rollback was successful -->

## Team & Communication

### Notification Channels
<!-- Slack channels, email lists, PagerDuty -->
<!-- Deployment announcement format -->

### On-Call & Escalation
<!-- On-call rotation -->
<!-- Escalation procedures for issues -->

## Notes & Observations

<!-- General notes about deployment patterns -->
<!-- Common issues and solutions -->
<!-- Performance observations -->

---

## Seres Migratorios — semillas de `/personalize` (2026-09-07)

- Deploy en Netlify desde `netlify.toml` (`npm run build` → `dist/`, Node 22). Sin adapter, sin functions. Deploy Preview por PR.
- Nada se mergea a `main` sin el Deploy Preview aprobado por Ruben. Un hook local bloquea el push directo a `main`: se empujan ramas de fase y se abre PR.
- Variables `PUBLIC_*` viven en el panel de Netlify (Site configuration > Environment variables), no en el repo.
- Redirects (301 `/fotografos` → `/artistas`, www → apex) se agregan en `netlify.toml`; los slugs de contenido nunca cambian.
- Rutas internas fuera del sitemap: `/kit`, `/gracias`, `/en/thanks`.
- Netlify Forms detecta el `<form name="convocatoria">` en el HTML del build: si `abierta` es `false` en ambos idiomas, el form desaparece del panel.
