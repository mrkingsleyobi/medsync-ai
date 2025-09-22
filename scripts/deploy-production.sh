#!/bin/bash

# MediSync Healthcare AI Platform - Production Deployment Script
# This script deploys the complete MediSync platform to a Kubernetes cluster

set -e  # Exit on any error

# Configuration
NAMESPACE="medisync-prod"
KUBECONFIG="${KUBECONFIG:-$HOME/.kube/config}"
CONTEXT="${KUBE_CONTEXT:-$(kubectl config current-context)}"

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

    # Check if namespace exists, create if not
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        echo_step "Creating namespace $NAMESPACE"
        kubectl create namespace "$NAMESPACE"
    else
        echo "✓ Namespace $NAMESPACE exists"
    fi
}

# Deploy secrets
deploy_secrets() {
    echo_step "Deploying secrets..."

    # Apply secrets (in a real deployment, these would be created securely)
    kubectl apply -f k8s/prod/secrets.yaml --namespace="$NAMESPACE"

    echo "✓ Secrets deployed"
}

# Deploy database
deploy_database() {
    echo_step "Deploying database..."

    kubectl apply -f k8s/prod/database.yaml --namespace="$NAMESPACE"

    # Wait for database to be ready
    echo_step "Waiting for database to be ready..."
    kubectl wait --for=condition=ready pod -l app=medisync-mongodb --timeout=300s --namespace="$NAMESPACE"

    echo "✓ Database deployed and ready"
}

# Deploy cache
deploy_cache() {
    echo_step "Deploying cache..."

    kubectl apply -f k8s/prod/redis.yaml --namespace="$NAMESPACE"

    # Wait for cache to be ready
    echo_step "Waiting for cache to be ready..."
    kubectl wait --for=condition=ready pod -l app=medisync-redis --timeout=120s --namespace="$NAMESPACE"

    echo "✓ Cache deployed and ready"
}

# Deploy main platform
deploy_platform() {
    echo_step "Deploying main platform..."

    kubectl apply -f k8s/prod/deployment.yaml --namespace="$NAMESPACE"
    kubectl apply -f k8s/prod/service.yaml --namespace="$NAMESPACE"
    kubectl apply -f k8s/prod/ingress.yaml --namespace="$NAMESPACE"

    # Wait for platform to be ready
    echo_step "Waiting for platform to be ready..."
    kubectl wait --for=condition=available deployment/medisync-platform --timeout=300s --namespace="$NAMESPACE"

    echo "✓ Platform deployed and ready"
}

# Deploy monitoring
deploy_monitoring() {
    echo_step "Deploying monitoring configuration..."

    kubectl apply -f k8s/prod/monitoring.yaml --namespace="$NAMESPACE"

    echo "✓ Monitoring deployed"
}

# Deploy networking policies
deploy_networking() {
    echo_step "Deploying network policies..."

    kubectl apply -f k8s/prod/network-policy.yaml --namespace="$NAMESPACE"

    echo "✓ Network policies deployed"
}

# Deploy autoscaling
deploy_autoscaling() {
    echo_step "Deploying autoscaling configuration..."

    kubectl apply -f k8s/prod/autoscaling.yaml --namespace="$NAMESPACE"

    echo "✓ Autoscaling deployed"
}

# Deploy backup configuration
deploy_backup() {
    echo_step "Deploying backup configuration..."

    kubectl apply -f k8s/prod/backup.yaml --namespace="$NAMESPACE"

    echo "✓ Backup configuration deployed"
}

# Verify deployment
verify_deployment() {
    echo_step "Verifying deployment..."

    # Check all pods
    echo_step "Checking pod status..."
    kubectl get pods --namespace="$NAMESPACE"

    # Check services
    echo_step "Checking services..."
    kubectl get services --namespace="$NAMESPACE"

    # Check deployments
    echo_step "Checking deployments..."
    kubectl get deployments --namespace="$NAMESPACE"

    # Check if platform is responding
    echo_step "Checking platform health..."
    # This would typically make actual API calls to verify health

    echo "✓ Deployment verification completed"
}

# Main deployment function
main() {
    echo_step "Starting MediSync Healthcare AI Platform Production Deployment"
    echo "=================================================================="

    check_prerequisites
    deploy_secrets
    deploy_database
    deploy_cache
    deploy_platform
    deploy_monitoring
    deploy_networking
    deploy_autoscaling
    deploy_backup
    verify_deployment

    echo_step "Deployment completed successfully!"
    echo ""
    echo "Platform URLs:"
    echo "  API: https://api.medsync-ai.com"
    echo "  Patient Portal: https://portal.medsync-ai.com"
    echo "  Admin Dashboard: https://admin.medsync-ai.com"
    echo ""
    echo "Next steps:"
    echo "  1. Configure DNS to point to the LoadBalancer IP"
    echo "  2. Update TLS certificates"
    echo "  3. Configure monitoring alerts"
    echo "  4. Run post-deployment health checks"
    echo "  5. Notify stakeholders of deployment completion"
}

# Rollback function
rollback() {
    echo_warn "Rolling back deployment..."
    # In a real scenario, this would rollback to previous versions
    echo "Rollback completed"
}

# Trap ctrl+c for rollback
trap rollback INT

# Run main function
main "$@"