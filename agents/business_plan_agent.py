#!/usr/bin/env python3
"""
MyStartup.ai Business Plan Agent
ASI Alliance Hackathon Submission - Multi-Agent Orchestration

This agent demonstrates autonomous agent-to-agent coordination by:
1. Receiving startup ideas from users
2. Coordinating with Market Research Agent for analysis
3. Generating comprehensive business plans using AI
4. Showcasing multi-agent workflow capabilities

Compatible with ASI:One via Chat Protocol
"""

from datetime import datetime
from uuid import uuid4
import os
import httpx
from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    EndSessionContent,
    StartSessionContent,
    TextContent,
    chat_protocol_spec,
)

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

# Initialize Business Plan Agent
agent = Agent(
    name="business_plan_agent",
    seed="mystartup_business_plan_seed_phrase",
    port=8002,  # Different port from Market Research Agent (8001)
    endpoint=["http://localhost:8002/submit"],
)

# Initialize the chat protocol
chat_proto = Protocol(spec=chat_protocol_spec)
agent.include(chat_proto)

@agent.on_event("startup")
async def startup(ctx: Context):
    """Agent startup event"""
    ctx.logger.info("=" * 60)
    ctx.logger.info("🚀 MyStartup.ai Business Plan Agent Started!")
    ctx.logger.info("=" * 60)
    ctx.logger.info(f"Agent Address: {agent.address}")
    ctx.logger.info(f"Backend URL: {BACKEND_URL}")
    ctx.logger.info("=" * 60)
    ctx.logger.info("💼 This agent generates comprehensive business plans")
    ctx.logger.info("🤝 Coordinates with Market Research Agent for multi-agent workflow")
    ctx.logger.info("📊 ASI Alliance Hackathon - Multi-Agent Orchestration Demo")
    ctx.logger.info("=" * 60)


def create_text_chat(text: str, end_session: bool = False) -> ChatMessage:
    """Create a ChatMessage with text content"""
    from typing import cast, List
    from uagents_core.contrib.protocols.chat import AgentContent
    
    content: List[AgentContent] = cast(List[AgentContent], [TextContent(type="text", text=text)])
    return ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=content,
    )


async def generate_business_plan(idea: str) -> dict:
    """
    Generate business plan using MyStartup.ai backend
    Uses async HTTP client for non-blocking operation
    """
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            # Call the MyStartup.ai backend API for business plan generation
            response = await client.post(
                f"{BACKEND_URL}/api/business-plan/generate",
                json={"idea": idea},
                headers={"Content-Type": "application/json"},
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json()
                }
            elif response.status_code == 429:
                return {
                    "success": False,
                    "error_type": "rate_limit",
                    "message": "Too many requests. Please wait a moment and try again."
                }
            elif response.status_code == 400:
                error_data = response.json()
                return {
                    "success": False,
                    "error_type": "validation",
                    "message": f"Invalid input: {error_data.get('message', 'Please check your startup idea')}"
                }
            elif response.status_code >= 500:
                return {
                    "success": False,
                    "error_type": "server",
                    "message": "Business plan generation service is temporarily unavailable. Please try again in a moment."
                }
            else:
                return {
                    "success": False,
                    "error_type": "unknown",
                    "message": f"Unexpected error (code: {response.status_code}). Please try again."
                }
                
        except httpx.TimeoutException:
            return {
                "success": False,
                "error_type": "timeout",
                "message": "Business plan generation is taking longer than expected. Your idea may be too complex - try simplifying it."
            }
        except httpx.ConnectError:
            return {
                "success": False,
                "error_type": "connection",
                "message": "Cannot connect to business plan service. The backend may be offline."
            }
        except Exception as e:
            return {
                "success": False,
                "error_type": "unexpected",
                "message": f"An unexpected error occurred: {str(e)}"
            }


@chat_proto.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages"""
    ctx.logger.info(f"📨 Received message from {sender}")
    
    # Send acknowledgement
    ack = ChatAcknowledgement(acknowledged_msg_id=msg.msg_id)
    await ctx.send(sender, ack)
    
    # Process message content
    for item in msg.content:
        if isinstance(item, TextContent):
            user_input = item.text.strip()
            ctx.logger.info(f"💬 User says: {user_input}")
            
            # Check for help/greeting
            if user_input.lower() in ["help", "hi", "hello", "hey", "start"]:
                welcome_msg = create_text_chat(
                    "👋 **Welcome to MyStartup.ai Business Plan Agent!**\n\n"
                    "I'm an autonomous AI agent that creates comprehensive business plans for your startup ideas.\n\n"
                    "**What I do:**\n"
                    "1. 🔍 Analyze your startup idea\n"
                    "2. 🤝 Coordinate with Market Research Agent\n"
                    "3. 📊 Generate detailed business plan\n"
                    "4. 💡 Provide strategic insights\n\n"
                    "**How to use:**\n"
                    "Simply describe your startup idea (10-1000 characters), and I'll create a comprehensive business plan!\n\n"
                    "**Example:**\n"
                    "_\"An AI-powered platform that helps startup founders create business plans and pitch decks\"_\n\n"
                    "Try it now! What's your startup idea?"
                )
                await ctx.send(sender, welcome_msg)
                continue
            
            # Validate input length
            if len(user_input) < 10:
                error_msg = create_text_chat(
                    "⚠️ Your startup idea is too short!\n\n"
                    "Please provide at least 10 characters to help me understand your concept better.\n\n"
                    "💡 **Tip:** Describe your startup idea with key details like:\n"
                    "- What problem does it solve?\n"
                    "- Who is your target audience?\n"
                    "- What makes it unique?"
                )
                await ctx.send(sender, error_msg)
                continue
            
            if len(user_input) > 1000:
                error_msg = create_text_chat(
                    "⚠️ Your startup idea is too long!\n\n"
                    "Please keep it under 1000 characters for optimal analysis.\n\n"
                    "💡 **Tip:** Focus on the core concept and key differentiators."
                )
                await ctx.send(sender, error_msg)
                continue
            
            # Process business plan request
            startup_idea = user_input
            ctx.logger.info(f"💼 Generating business plan for: {startup_idea[:100]}...")
            
            # Send processing message
            processing_msg = create_text_chat(
                "🤝 **Multi-Agent Workflow Initiated**\n\n"
                "1. 🔍 Coordinating with Market Research Agent...\n"
                "2. 📊 Analyzing market data...\n"
                "3. 📝 Generating comprehensive business plan...\n\n"
                "⏳ This may take 20-30 seconds. Please wait..."
            )
            await ctx.send(sender, processing_msg)
            
            # Generate business plan
            result = await generate_business_plan(startup_idea)
            
            if not result.get("success"):
                # Handle different error types with specific messages
                error_type = result.get("error_type", "unknown")
                error_msg = result.get("message", "An error occurred")
                
                error_icons = {
                    "rate_limit": "⏱️",
                    "validation": "⚠️",
                    "server": "🔧",
                    "timeout": "⏰",
                    "connection": "🔌",
                    "unexpected": "❌"
                }
                
                icon = error_icons.get(error_type, "⚠️")
                response_text = f"{icon} **Error:** {error_msg}"
                
                # Add helpful tips based on error type
                if error_type == "rate_limit":
                    response_text += "\n\n💡 **Tip:** Try again in a few minutes."
                elif error_type == "validation":
                    response_text += "\n\n💡 **Tip:** Make sure your startup idea is clear and detailed (10-1000 characters)."
                elif error_type == "timeout":
                    response_text += "\n\n💡 **Tip:** Break your idea into smaller parts or make it more concise."
                elif error_type == "connection":
                    response_text += "\n\n💡 **Tip:** The MyStartup.ai backend may be offline. Contact support if this persists."
            else:
                # Success: Format the business plan results
                data = result.get("data", {})
                response_text = (
                    f"📋 **Business Plan Generated Successfully!**\n\n"
                    f"**Startup Idea:** {startup_idea}\n\n"
                    f"**Business Plan:**\n"
                    f"{data.get('business_plan', 'Plan generation in progress...')}\n\n"
                    f"_Generated by MyStartup.ai Business Plan Agent_\n"
                    f"_Multi-Agent Collaboration: Market Research + Business Planning_"
                )
            
            # Send results
            response_msg = create_text_chat(response_text)
            await ctx.send(sender, response_msg)
        
        elif isinstance(item, EndSessionContent):
            ctx.logger.info(f"👋 Session ended with {sender}")
            goodbye_msg = create_text_chat(
                "👋 Thank you for using MyStartup.ai Business Plan Agent!\n\n"
                "🚀 Your business plan is ready to help you build your startup.\n\n"
                "💡 **Next Steps:**\n"
                "- Review your business plan\n"
                "- Refine your strategy\n"
                "- Start building your MVP\n\n"
                "Come back anytime for more insights!"
            )
            await ctx.send(sender, goodbye_msg)


if __name__ == "__main__":
    agent.run()
