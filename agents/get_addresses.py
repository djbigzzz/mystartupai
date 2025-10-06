#!/usr/bin/env python3
"""
Helper script to get agent addresses
Run this to get the addresses of your agents for configuration
"""

from uagents import Agent

# Market Research Agent
market_research_agent = Agent(
    name="market_research_agent",
    seed="mystartup_market_research_seed_phrase",
    port=8001,
)

# Business Plan Agent
business_plan_agent = Agent(
    name="business_plan_agent",
    seed="mystartup_business_plan_seed_phrase",
    port=8002,
)

print("=" * 60)
print("MyStartup.ai Multi-Agent System - Agent Addresses")
print("=" * 60)
print()
print("Market Research Agent:")
print(f"  Address: {market_research_agent.address}")
print(f"  Port: 8001")
print()
print("Business Plan Agent:")
print(f"  Address: {business_plan_agent.address}")
print(f"  Port: 8002")
print()
print("=" * 60)
print("Configuration Instructions:")
print("=" * 60)
print()
print("Add this to your .env file:")
print()
print(f"MARKET_RESEARCH_AGENT_ADDRESS={market_research_agent.address}")
print()
print("Then restart both agents for the configuration to take effect.")
print()
