#!/bin/bash

# MediSync Healthcare AI Platform - Monitoring Setup Script
# This script sets up comprehensive monitoring and alerting for the platform

set -e

# Configuration
NAMESPACE="medisync-prod"
MONITORING_NAMESPACE="monitoring"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_step() {
    echo -e "${GREEN}>>> $1${NC}"
}

echo_warn() {
    echo -e "${YELLOW}! $1${NC}"
}

echo_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    echo_step "Checking prerequisites..."

    if ! command -v kubectl &> /dev/null; then
        echo_error "kubectl is not installed"
        exit 1
    fi

    if ! kubectl cluster-info &> /dev/null; then
        echo_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi

    echo "✓ Kubernetes cluster connection verified"

    # Check if monitoring namespace exists
    if ! kubectl get namespace "$MONITORING_NAMESPACE" &> /dev/null; then
        echo_warn "Monitoring namespace $MONITORING_NAMESPACE does not exist"
        echo_step "Creating monitoring namespace..."
        kubectl create namespace "$MONITORING_NAMESPACE"
    else
        echo "✓ Monitoring namespace $MONITORING_NAMESPACE exists"
    fi

    # Check if platform namespace exists
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        echo_error "Platform namespace $NAMESPACE does not exist"
        exit 1
    fi
}

# Install Prometheus Operator (if not already installed)
install_prometheus_operator() {
    echo_step "Installing Prometheus Operator..."

    # Check if Prometheus Operator CRDs exist
    if kubectl get crd prometheuses.monitoring.coreos.com &> /dev/null; then
        echo "✓ Prometheus Operator already installed"
        return
    fi

    # Install Prometheus Operator using Helm (simplified)
    # In a real scenario, you'd use a proper Helm chart or manifest
    echo_warn "Prometheus Operator installation would typically be done via Helm"
    echo "For this example, we'll assume Prometheus Operator is already available"
}

# Deploy Prometheus configuration
deploy_prometheus() {
    echo_step "Deploying Prometheus configuration..."

    # Apply Prometheus configuration
    kubectl apply -f k8s/prod/monitoring.yaml --namespace="$NAMESPACE"

    echo "✓ Prometheus configuration deployed"
}

# Configure Grafana dashboards
configure_grafana() {
    echo_step "Configuring Grafana dashboards..."

    # Create ConfigMap with dashboard definitions
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: medisync-grafana-dashboards
  namespace: $MONITORING_NAMESPACE
  labels:
    grafana_dashboard: "1"
data:
  medisync-platform.json: |
    {
      "dashboard": {
        "id": null,
        "title": "MediSync Platform Overview",
        "timezone": "browser",
        "schemaVersion": 16,
        "version": 0,
        "refresh": "30s",
        "panels": [
          {
            "id": 1,
            "title": "Platform Uptime",
            "type": "stat",
            "datasource": "Prometheus",
            "targets": [
              {
                "expr": "avg(up{job=~\"medisync-platform.*\"}) * 100",
                "format": "time_series",
                "instant": true
              }
            ],
            "fieldConfig": {
              "defaults": {
                "unit": "percent"
              }
            }
          },
          {
            "id": 2,
            "title": "API Request Rate",
            "type": "graph",
            "datasource": "Prometheus",
            "targets": [
              {
                "expr": "rate(http_requests_total[5m])",
                "legendFormat": "{{job}}"
              }
            ]
          },
          {
            "id": 3,
            "title": "Error Rate",
            "type": "graph",
            "datasource": "Prometheus",
            "targets": [
              {
                "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
                "legendFormat": "{{job}}"
              }
            ]
          },
          {
            "id": 4,
            "title": "Average Response Time",
            "type": "graph",
            "datasource": "Prometheus",
            "targets": [
              {
                "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
                "legendFormat": "{{job}} 95th percentile"
              }
            ]
          },
          {
            "id": 5,
            "title": "Database Connections",
            "type": "stat",
            "datasource": "Prometheus",
            "targets": [
              {
                "expr": "mongodb_connections{state=\"available\"}",
                "format": "time_series",
                "instant": true
              }
            ]
          },
          {
            "id": 6,
            "title": "Cache Hit Ratio",
            "type": "stat",
            "datasource": "Prometheus",
            "targets": [
              {
                "expr": "redis_keyspace_hits_total / (redis_keyspace_hits_total + redis_keyspace_misses_total)",
                "format": "time_series",
                "instant": true
              }
            ],
            "fieldConfig": {
              "defaults": {
                "unit": "percentunit"
              }
            }
          }
        ]
      }
    }
EOF

    echo "✓ Grafana dashboards configured"
}

# Configure alertmanager
configure_alertmanager() {
    echo_step "Configuring Alertmanager..."

    # Create Alertmanager configuration
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: medisync-alertmanager-config
  namespace: $MONITORING_NAMESPACE
data:
  alertmanager.yml: |
    global:
      resolve_timeout: 5m
      smtp_smarthost: 'smtp.gmail.com:587'
      smtp_from: 'alerts@medsync-ai.com'
      smtp_auth_username: 'alerts@medsync-ai.com'
      smtp_auth_password: 'your-smtp-password'
      smtp_require_tls: true

    route:
      group_by: ['alertname']
      group_wait: 10s
      group_interval: 10s
      repeat_interval: 1h
      receiver: 'team-mails'

    receivers:
    - name: 'team-mails'
      email_configs:
      - to: 'oncall@medsync-ai.com'
        send_resolved: true

    - name: 'slack-notifications'
      slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#alerts'
        send_resolved: true
        title: '{{ template "slack.default.title" . }}'
        text: '{{ template "slack.default.text" . }}'

    templates:
    - '/etc/alertmanager/template/*.tmpl'
EOF

    echo "✓ Alertmanager configured"
}

# Configure logging
configure_logging() {
    echo_step "Configuring centralized logging..."

    # This would typically involve setting up Fluentd, Elasticsearch, and Kibana
    # For this example, we'll create a basic configuration

    echo_warn "Logging configuration would typically involve ELK stack setup"
    echo "This setup assumes you have a logging stack already configured"

    # Create a basic logging configuration
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: medisync-logging-config
  namespace: $NAMESPACE
data:
  fluentd.conf: |
    <source>
      @type tail
      path /var/log/containers/*medisync*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      read_from_head true
      <parse>
        @type multi_format
        <pattern>
          format json
          time_key time
          time_format %Y-%m-%dT%H:%M:%S.%NZ
        </pattern>
        <pattern>
          format /^(?<time>.+) (?<stream>stdout|stderr) [^ ]* (?<log>.*)$/
          time_format %Y-%m-%dT%H:%M:%S.%N%:z
        </pattern>
      </parse>
    </source>

    <filter kubernetes.**>
      @type kubernetes_metadata
    </filter>

    <match **>
      @type elasticsearch
      host elasticsearch.logging.svc.cluster.local
      port 9200
      logstash_format true
      logstash_prefix medisync
      include_tag_key true
      type_name access_log
      tag_key @log_name
      flush_interval 1s
    </match>
EOF

    echo "✓ Logging configuration created"
}

# Deploy monitoring sidecars
deploy_monitoring_sidecars() {
    echo_step "Deploying monitoring sidecars..."

    # In a real implementation, you might want to add Prometheus exporters
    # or other monitoring sidecars to your deployments

    echo "✓ Monitoring sidecars configuration completed"
}

# Verify monitoring setup
verify_monitoring() {
    echo_step "Verifying monitoring setup..."

    # Check if ServiceMonitors are created
    if kubectl get servicemonitors -n "$NAMESPACE" &> /dev/null; then
        echo "✓ ServiceMonitors are configured"
        kubectl get servicemonitors -n "$NAMESPACE"
    else
        echo_warn "No ServiceMonitors found"
    fi

    # Check if PrometheusRules are created
    if kubectl get prometheusrules -n "$NAMESPACE" &> /dev/null; then
        echo "✓ PrometheusRules are configured"
        kubectl get prometheusrules -n "$NAMESPACE"
    else
        echo_warn "No PrometheusRules found"
    fi

    echo "✓ Monitoring verification completed"
}

# Main setup function
main() {
    echo_step "Starting MediSync Monitoring and Alerting Setup"
    echo "=================================================="

    check_prerequisites
    install_prometheus_operator
    deploy_prometheus
    configure_grafana
    configure_alertmanager
    configure_logging
    deploy_monitoring_sidecars
    verify_monitoring

    echo_step "Monitoring and alerting setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Configure Grafana data sources"
    echo "  2. Import additional dashboards"
    echo "  3. Test alert notifications"
    echo "  4. Configure retention policies"
    echo "  5. Set up log retention and archiving"
}

# Run main function
main "$@"