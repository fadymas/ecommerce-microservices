# Recreate cluster
kind create cluster --name ecommerce --config kind-config.yaml   

# Install ArgoCD again
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Deploy services from Git-backed manifests
kubectl apply -f k8s/services.yaml

# Port-forward to test
kubectl port-forward svc/catalog-service 8001:8001
kubectl port-forward svc/cart-service    8002:8002
kubectl port-forward svc/order-service   8003:8003
kubectl port-forward svc/payment-service 8004:8004
