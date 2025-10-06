#!/usr/bin/env python3
"""
Test script for multi-agent communication
This script sends a test message to the Business Plan Agent and verifies agent-to-agent coordination
"""

import asyncio
from datetime import datetime
from uuid import uuid4
from uagents import Agent
from uagents_core.contrib.protocols.chat import ChatMessage, TextContent
from typing import cast, List
from uagents_core.contrib.protocols.chat import AgentContent

# Create a test client agent
test_agent = Agent(
    name="test_client",
    seed="test_client_seed_123",
    port=8003,
)

BUSINESS_PLAN_AGENT_ADDRESS = "agent1qwsr2q9r2qhzu95wcc7wvfhvjq25mm56pvtzyh479skecwhvq7hlyfplwv6"

def create_text_chat(text: str) -> ChatMessage:
    """Create a ChatMessage with text content"""
    content: List[AgentContent] = cast(List[AgentContent], [TextContent(type="text", text=text)])
    return ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=content,
    )

@test_agent.on_event("startup")
async def test_workflow(ctx):
    """Test the multi-agent workflow"""
    ctx.logger.info("=" * 60)
    ctx.logger.info("🧪 Testing Multi-Agent Workflow")
    ctx.logger.info("=" * 60)
    
    # Wait a bit for agents to initialize
    await asyncio.sleep(2)
    
    # Send test message to Business Plan Agent
    startup_idea = "An AI-powered platform that helps startup founders create business plans and pitch decks"
    
    ctx.logger.info(f"📤 Sending test message to Business Plan Agent...")
    ctx.logger.info(f"   Idea: {startup_idea}")
    
    test_msg = create_text_chat(startup_idea)
    await ctx.send(BUSINESS_PLAN_AGENT_ADDRESS, test_msg)
    
    ctx.logger.info("✅ Test message sent!")
    ctx.logger.info("   Business Plan Agent should:")
    ctx.logger.info("   1. Receive the message")
    ctx.logger.info("   2. Send request to Market Research Agent")
    ctx.logger.info("   3. Receive market research response")
    ctx.logger.info("   4. Compile business plan")
    ctx.logger.info("   5. Send final plan back to this client")
    ctx.logger.info("=" * 60)

@test_agent.on_message(ChatMessage)
async def handle_response(ctx, sender: str, msg: ChatMessage):
    """Handle responses from agents"""
    ctx.logger.info(f"📬 Received response from {sender}")
    
    for item in msg.content:
        if isinstance(item, TextContent):
            ctx.logger.info(f"💬 Response: {item.text[:200]}...")
            
            if "Business Plan Generated Successfully" in item.text:
                ctx.logger.info("=" * 60)
                ctx.logger.info("✅ MULTI-AGENT WORKFLOW SUCCESS!")
                ctx.logger.info("=" * 60)
                ctx.logger.info("The following agent coordination occurred:")
                ctx.logger.info("1. ✓ Test Client → Business Plan Agent")
                ctx.logger.info("2. ✓ Business Plan Agent → Market Research Agent")
                ctx.logger.info("3. ✓ Market Research Agent → Business Plan Agent")
                ctx.logger.info("4. ✓ Business Plan Agent → Test Client")
                ctx.logger.info("=" * 60)

if __name__ == "__main__":
    print("\n🧪 Multi-Agent Test Client")
    print("Make sure Market Research Agent (port 8001) and Business Plan Agent (port 8002) are running!")
    print("\nStarting test in 3 seconds...\n")
    test_agent.run()
