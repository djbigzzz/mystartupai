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
MARKET_RESEARCH_AGENT_ADDRESS = os.getenv("MARKET_RESEARCH_AGENT_ADDRESS", "")

# Initialize Business Plan Agent
agent = Agent(
    name="business_plan_agent",
    seed="mystartup_business_plan_seed_phrase",
    port=8002,  # Different port from Market Research Agent (8001)
    endpoint=["http://localhost:8002/submit"],
)

# Store pending requests to correlate agent responses
pending_requests = {}

# Initialize the chat protocol
chat_proto = Protocol(spec=chat_protocol_spec)

@agent.on_event("startup")
async def startup(ctx: Context):
    """Agent startup event"""
    ctx.logger.info("=" * 60)
    ctx.logger.info("🚀 MyStartup.ai Business Plan Agent Started!")
    ctx.logger.info("=" * 60)
    ctx.logger.info(f"Agent Address: {agent.address}")
    ctx.logger.info(f"Backend URL: {BACKEND_URL}")
    ctx.logger.info(f"Market Research Agent: {MARKET_RESEARCH_AGENT_ADDRESS or 'Not configured'}")
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
            text_content = item.text.strip()
            
            # Check if this is an agent response (by format, not just sender)
            # The sender might be a session-specific address, not the base agent address
            if text_content.startswith("AGENT_RESPONSE:"):
                ctx.logger.info(f"📬 Received agent-to-agent response from {sender}")
                
                # Parse the response to extract request_id and market research data
                parts = text_content.split(":", 3)
                if len(parts) >= 4:
                    request_id = parts[1]
                    status = parts[2]
                    data = parts[3] if len(parts) > 3 else ""
                    
                    ctx.logger.info(f"📊 Processing market research response for request {request_id}")
                    
                    # Find the pending request
                    if request_id in pending_requests:
                        request_data = pending_requests[request_id]
                        user_address = request_data["user_address"]
                        startup_idea = request_data["startup_idea"]
                        
                        if status == "SUCCESS":
                            # Compile business plan using backend
                            ctx.logger.info(f"✅ Market research successful, generating business plan...")
                            
                            # Now call backend to compile full business plan
                            result = await generate_business_plan(startup_idea)
                            
                            if result.get("success"):
                                plan_data = result.get("data", {})
                                response_msg = create_text_chat(
                                    f"📋 **Business Plan Generated Successfully!**\n\n"
                                    f"**Startup Idea:** {startup_idea}\n\n"
                                    f"**Market Research (from Market Research Agent):**\n"
                                    f"{data[:500]}...\n\n"
                                    f"**Business Plan:**\n"
                                    f"{plan_data.get('business_plan', 'Plan generation in progress...')}\n\n"
                                    f"_Generated via Multi-Agent Collaboration:_\n"
                                    f"_1. Market Research Agent → Market Analysis_\n"
                                    f"_2. Business Plan Agent → Complete Business Plan_"
                                )
                            else:
                                response_msg = create_text_chat(
                                    f"⚠️ Market research completed, but business plan generation failed:\n\n"
                                    f"{result.get('message', 'Unknown error')}"
                                )
                            
                            await ctx.send(user_address, response_msg)
                            
                        else:
                            # Market research failed
                            error_msg = create_text_chat(
                                f"❌ Market Research Agent returned an error:\n\n{data}"
                            )
                            await ctx.send(user_address, error_msg)
                        
                        # Clean up pending request
                        del pending_requests[request_id]
                        ctx.logger.info(f"🧹 Cleaned up pending request {request_id}")
                    else:
                        ctx.logger.warning(f"⚠️ Received response for unknown request {request_id}")
                continue
            
            # Handle user messages
            user_input = text_content
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
                "1. 🔍 Sending request to Market Research Agent...\n"
                "2. 📊 Awaiting market analysis...\n"
                "3. 📝 Will compile business plan...\n\n"
                "⏳ This may take 20-30 seconds. Please wait..."
            )
            await ctx.send(sender, processing_msg)
            
            # Check if Market Research Agent is configured
            if not MARKET_RESEARCH_AGENT_ADDRESS:
                error_msg = create_text_chat(
                    "⚠️ **Configuration Error**\n\n"
                    "Market Research Agent address not configured.\n\n"
                    "Please set the MARKET_RESEARCH_AGENT_ADDRESS environment variable."
                )
                await ctx.send(sender, error_msg)
                continue
            
            # Store the user's address for later response
            request_id = str(uuid4())
            pending_requests[request_id] = {
                "user_address": sender,
                "startup_idea": startup_idea,
                "market_research": None,
                "timestamp": datetime.utcnow()
            }
            
            # Send message to Market Research Agent
            ctx.logger.info(f"🔗 Sending agent-to-agent message to {MARKET_RESEARCH_AGENT_ADDRESS}")
            
            research_request = create_text_chat(
                f"AGENT_REQUEST:{request_id}:{startup_idea}"
            )
            
            await ctx.send(MARKET_RESEARCH_AGENT_ADDRESS, research_request)
            
            # Note: Response will be handled by the agent response handler above
            ctx.logger.info(f"✅ Request sent to Market Research Agent (request_id: {request_id})")
        
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


@chat_proto.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements for sent messages"""
    ctx.logger.info(f"✅ Message acknowledged by {sender}: {msg.acknowledged_msg_id}")


# Include the chat protocol and publish manifest to Agentverse
agent.include(chat_proto, publish_manifest=True)


if __name__ == "__main__":
    agent.run()
