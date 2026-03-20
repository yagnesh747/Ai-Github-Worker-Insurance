# AI Gig Worker Insurance

## Problem Statement
Gig delivery workers working with platforms like Zomato, Swiggy, Amazon, and Zepto often lose income due to external disruptions such as heavy rain, extreme heat, pollution, or sudden area restrictions. These workers depend on daily earnings and currently do not have a reliable system to protect their income during such events.

## Solution
This project proposes an AI-powered parametric insurance platform that automatically detects disruptions and provides instant payouts to gig delivery workers. The platform monitors environmental conditions and triggers insurance claims automatically when predefined thresholds are reached.

## Target Users
The primary users of this platform are delivery workers operating on platforms such as:

- Zomato  
- Swiggy  
- Amazon Delivery  
- Quick Commerce Platforms  

## Key Features
- AI-based risk prediction
- Dynamic weekly premium calculation
- Automatic disruption detection using APIs
- Fraud detection using location verification
- Instant payout for income loss

## Tech Stack
Frontend: Web Application  
Backend: Python (FastAPI / Flask)  
Database: MongoDB / MySQL  
AI/ML: Python, Scikit-learn  
External APIs: Weather API  

## System Workflow
1. Worker registers on the platform with details like name, location, and delivery platform.
2. The system uses AI to calculate a weekly insurance premium based on risk factors such as weather conditions and location.
3. Once the worker purchases the weekly plan, the insurance policy becomes active.
4. The platform continuously monitors environmental disruptions such as heavy rain, extreme heat, and pollution using weather APIs.
5. If a disruption occurs (for example rainfall > 50mm), the system automatically triggers a claim.
6. Fraud detection verifies the worker's location and activity.
7. If the claim is valid, the system processes an automatic payout to compensate for the worker's lost income.

## Future Scope
- Advanced AI fraud detection
- Mobile application for workers
- Real-time analytics dashboard
- Integration with payment gateways

## System Architecture

Worker App → Registration System → Backend Server → AI Risk Model → Disruption Monitoring (Weather API / Pollution API) → Claim Processing → Fraud Detection → Payout System → Worker Receives Compensation


## Delivery Worker Persona

Name: Rahul  
Age: 26  
Occupation: Food Delivery Partner (Swiggy)

Rahul works 8–10 hours daily delivering food in urban areas. His income depends on the number of deliveries he completes each day. During heavy rain, extreme heat, or high pollution levels, Rahul is unable to work efficiently and often loses income.

Our platform helps workers like Rahul by providing a weekly insurance plan that automatically compensates them when environmental disruptions prevent them from working.



## Weekly Premium Model

Our platform provides affordable weekly insurance plans for delivery workers.

Example plan:

Basic Plan
Premium: ₹30 per week
Coverage: Up to ₹500 payout during disruptions

Premium Plan
Premium: ₹50 per week
Coverage: Up to ₹1000 payout during disruptions

The premium is calculated using an AI-based risk model that considers:

- Location risk
- Historical weather patterns
- Pollution levels
- Delivery activity hours

- ## Adversarial Defense & Anti-Spoofing Strategy

### 1. Differentiation: Identifying Real vs Fake Claims

Instead of trusting only GPS data, our system uses a combination of signals to understand whether a delivery partner is genuinely stuck or trying to manipulate the system.

We look at movement patterns from device sensors like accelerometer and gyroscope to check if the user is actually moving or just sitting idle. We also compare the user’s location with real-time weather data to confirm whether the claimed weather conditions actually exist in that area.

Additionally, our system learns normal delivery behavior over time (such as routes, speed, and stops). If a claim shows unusual or unrealistic patterns, it is flagged for further verification.

This approach helps us distinguish between genuine situations and artificially generated ones.

### 2. Data Points Used Beyond GPS

To make the system more reliable, we analyze multiple data sources instead of depending only on GPS:

- Network-based location (IP address and nearby cell towers)
- Device sensor activity (movement, orientation)
- Historical route and travel patterns
- Real-time weather information
- Time-based activity patterns (sudden spikes in claims)
- Battery usage behavior
- Detection of suspicious group activity (multiple users claiming from same fake zone)

By combining these signals, the system can detect coordinated fraud attempts more effectively.

### 3. UX Balance: Protecting Honest Users

While preventing fraud is important, we also ensure that genuine users are not unfairly affected.

If a claim looks suspicious, it is not immediately rejected. Instead, it is marked for review. Users are given some flexibility in case of network issues or temporary signal loss.

We also provide an option for users to submit additional proof (such as photos) if needed. Based on a confidence score, claims are either approved instantly, delayed for verification, or sent for manual review.

In rare cases, human intervention is available to resolve edge cases.

### Final Note

Our goal is to build a system that is both secure and fair — preventing misuse while maintaining trust with genuine delivery partners. By combining multiple data sources, intelligent analysis, and user-friendly workflows, we create a more resilient and reliable platform.
