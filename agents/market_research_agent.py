"""
Market Research Agent for MyStartup.ai
ASI Alliance Hackathon Submission - Innovation Lab

This agent performs intelligent market research for startup ideas using AI.
It integrates with the MyStartup.ai platform and is discoverable via ASI:One.
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

# Initialize the Market Research Agent
agent = Agent(
    name="market_research_agent",
    seed="mystartup_market_research_seed_phrase",
    port=8001,
    endpoint=["http://localhost:8001/submit"],
)

# Backend API configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize the chat protocol
chat_proto = Protocol(spec=chat_protocol_spec)


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


async def perform_market_research(idea: str) -> dict:
    """
    Perform market research analysis using OpenAI API
    This connects to the existing MyStartup.ai backend logic
    Uses async HTTP client for non-blocking operation
    """
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # Call the MyStartup.ai backend API for market research
            response = await client.post(
                f"{BACKEND_URL}/api/market-research/analyze",
                json={"idea": idea},
                headers={"Content-Type": "application/json"},
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json()
                }
            elif response.status_code == 429:
                # Rate limit error
                return {
                    "success": False,
                    "error_type": "rate_limit",
                    "message": "Too many requests. Please wait a moment and try again."
                }
            elif response.status_code == 400:
                # Validation error
                error_data = response.json()
                return {
                    "success": False,
                    "error_type": "validation",
                    "message": f"Invalid input: {error_data.get('message', 'Please check your startup idea')}"
                }
            elif response.status_code >= 500:
                # Server error
                return {
                    "success": False,
                    "error_type": "server",
                    "message": "Analysis service is temporarily unavailable. Please try again in a moment."
                }
            else:
                # Other errors
                return {
                    "success": False,
                    "error_type": "unknown",
                    "message": f"Unexpected error (code: {response.status_code}). Please try again."
                }
                
        except httpx.TimeoutException:
            return {
                "success": False,
                "error_type": "timeout",
                "message": "Analysis is taking longer than expected. Your idea may be too complex - try simplifying it."
            }
        except httpx.ConnectError:
            return {
                "success": False,
                "error_type": "connection",
                "message": "Cannot connect to analysis service. The backend may be offline."
            }
        except Exception as e:
            return {
                "success": False,
                "error_type": "unexpected",
                "message": f"An unexpected error occurred: {str(e)}"
            }


@chat_proto.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages from users or other agents"""
    ctx.logger.info(f"📨 Received message from {sender}")
    
    # Send acknowledgement
    await ctx.send(
        sender,
        ChatAcknowledgement(
            timestamp=datetime.utcnow(),
            acknowledged_msg_id=msg.msg_id
        )
    )
    
    # Process each content item
    for item in msg.content:
        if isinstance(item, StartSessionContent):
            ctx.logger.info(f"🚀 Session started with {sender}")
            welcome_msg = create_text_chat(
                "Welcome to MyStartup.ai Market Research Agent! "
                "I can analyze your startup idea and provide market insights. "
                "Just describe your startup idea and I'll get to work!"
            )
            await ctx.send(sender, welcome_msg)
        
        elif isinstance(item, TextContent):
            ctx.logger.info(f"💬 Text message from {sender}: {item.text}")
            
            # Check if this is an agent-to-agent request
            if item.text.startswith("AGENT_REQUEST:"):
                ctx.logger.info(f"🤝 Received agent-to-agent request from {sender}")
                parts = item.text.split(":", 2)
                if len(parts) >= 3:
                    request_id = parts[1]
                    startup_idea = parts[2]
                    
                    ctx.logger.info(f"📊 Processing agent request {request_id} for: {startup_idea[:100]}")
                    
                    # Perform market research
                    result = await perform_market_research(startup_idea)
                    
                    if result.get("success"):
                        data = result.get("data", {})
                        analysis = data.get('analysis', 'Analysis completed')
                        response_msg = create_text_chat(
                            f"AGENT_RESPONSE:{request_id}:SUCCESS:{analysis}"
                        )
                    else:
                        error_msg = result.get("message", "Analysis failed")
                        response_msg = create_text_chat(
                            f"AGENT_RESPONSE:{request_id}:ERROR:{error_msg}"
                        )
                    
                    ctx.logger.info(f"✅ Sending agent-to-agent response for request {request_id}")
                    await ctx.send(sender, response_msg)
                    continue
            
            # Regular user request
            startup_idea = item.text
            
            # Send processing message
            processing_msg = create_text_chat(
                "🔍 Analyzing your startup idea... This may take a moment."
            )
            await ctx.send(sender, processing_msg)
            
            # Perform market research
            result = await perform_market_research(startup_idea)
            
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
                # Success: Format the market research results
                data = result.get("data", {})
                response_text = (
                    f"📊 **Market Research Analysis Complete!**\n\n"
                    f"**Startup Idea:** {startup_idea}\n\n"
                    f"**Analysis Results:**\n"
                    f"{data.get('analysis', 'Analysis in progress...')}\n\n"
                    f"_Generated by MyStartup.ai Market Research Agent_"
                )
            
            # Send results
            response_msg = create_text_chat(response_text)
            await ctx.send(sender, response_msg)
        
        elif isinstance(item, EndSessionContent):
            ctx.logger.info(f"👋 Session ended with {sender}")
            goodbye_msg = create_text_chat(
                "Thank you for using MyStartup.ai Market Research Agent! "
                "Good luck with your startup journey! 🚀"
            )
            await ctx.send(sender, goodbye_msg)
        
        else:
            ctx.logger.warning(f"⚠️ Received unexpected content type from {sender}")


@chat_proto.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements for sent messages"""
    ctx.logger.info(
        f"✅ Received acknowledgement from {sender} "
        f"for message {msg.acknowledged_msg_id}"
    )


# Startup event
@agent.on_event("startup")
async def startup(ctx: Context):
    """Log agent startup"""
    ctx.logger.info("=" * 50)
    ctx.logger.info("🤖 MyStartup.ai Market Research Agent")
    ctx.logger.info("=" * 50)
    ctx.logger.info(f"Agent Name: {agent.name}")
    ctx.logger.info(f"Agent Address: {agent.address}")
    ctx.logger.info(f"Backend URL: {BACKEND_URL}")
    ctx.logger.info("Status: Ready to perform market research!")
    ctx.logger.info("=" * 50)


# Include the chat protocol and publish manifest to Agentverse
agent.include(chat_proto, publish_manifest=True)


if __name__ == "__main__":
    # Run the agent
    agent.run()
