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
