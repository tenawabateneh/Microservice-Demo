=====================================================================
// This is to create an object which is a "Pod" object
=====================================================================

apiVersion: v1
kind: Pod
metadata:
  name: posts
spec:
  containers:
    - name: posts
      image: tenaw/posts:latest  # or specify your desired tag


======================================================================
// This is all about creating a NodePort: to exspose the object(Pod)
   outside world
======================================================================

apiVersion: v1
kind: Service
metadata:
  name: posts-srv
spec:
  type: NodePort
  selector:
    app: posts
  ports:
    - name: posts
      protocol: TCP
      port: 4000
      targetPort: 4000


=======================================================================
// This is all about creating an Object(Deployment and Service: 
  #Deployment-> Encharge of running and restarting a pod properly
  #Service-> Providing memorable URL(name as an IP) to the pods inside 
	     the cluster. e.g. instaed of localhost:3000, use post-srv. 
=======================================================================

apiVersion: apps/v1
kind: Deployment
metadata:
  name: posts-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: posts
  template:
    metadata:
      labels:
        app: posts
    spec:
      containers:
        - name: posts
          image: tenaw/posts
---	#// Indicates that creating another object(Service) on the next line
apiVersion: v1
kind: Service
metadata:
  name: posts-clusterip-srv
spec:
  selector:
    app: posts
  ports:
    - name: posts
      protocol: TCP
      port: 4000
      targetPort: 4000


# apiVersion: v1
# kind: Service
# metadata:
#   name: posts-clusterip-srv
# spec:
#   selector:
#     app: posts
#   type: ClusterIP
#   ports:
#     - name: posts
#       protocol: TCP
#       port: 4000
#       targetPort: 4000