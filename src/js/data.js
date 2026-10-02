// All page content lives here. Editing a tool, task or work area never needs a change anywhere else.

// Work areas, in display order. `king` is "The big three". `icon` is SVG path data for a 24×24 stroke icon.
export const CATS = [
  { id: 'king', name: 'All-rounders', tag: 'Start here. They do a bit of everything.',
    icon: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4Z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z"/>' },
  { id: 'mkt', name: 'Marketing', tag: 'Create. Reach. Grow.',
    icon: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z"/><path d="M15 9a3 3 0 0 1 0 6M18 6a7 7 0 0 1 0 12"/>' },
  { id: 'sales', name: 'Sales', tag: 'Find leads. Close deals.',
    icon: '<path d="M4 20V14M10 20V9M16 20v-6M22 4l-7 7-4-4-7 7"/>' },
  { id: 'design', name: 'Design', tag: 'Imagine. Create. Stand out.',
    icon: '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-1.3-1-1.4-1-2.6 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-4-4-7.2-9-7.2Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>' },
  { id: 'video', name: 'Video', tag: 'Edit. Animate. Go viral.',
    icon: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="m10 9 5 3-5 3Z"/>' },
  { id: 'prod', name: 'Productivity', tag: 'Organize. Automate. Get more done.',
    icon: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/><circle cx="12" cy="12" r="3"/>' },
  { id: 'code', name: 'Programming', tag: 'Build. Code. Innovate.',
    icon: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>' },
  { id: 'assist', name: 'AI Assistants', tag: 'Ask. Think. Get answers.',
    icon: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>' },
  { id: 'agent', name: 'Agents & Browsers', tag: 'Delegate. Research. Browse.',
    icon: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/>' },
  { id: 'audio', name: 'Audio & Voice', tag: 'Speak. Score. Sound pro.',
    icon: '<path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4"/>' }
];

// [id, name, category, url, what it's for, maker]
const TOOL_ROWS = [
  ['claude','Claude','king','https://claude.ai','Your AI coworker for writing, research and analysis. Claude Code is its agent that writes and runs code for you.','Anthropic'],
  ['chatgpt','ChatGPT','king','https://chatgpt.com','The everyday assistant for questions, writing, images and voice. Codex is its agent for building software.','OpenAI'],
  ['gemini','Gemini','king','https://gemini.google.com','Google\u2019s assistant, wired into Gmail, Docs and Search, with Nano Banana images. Gemini CLI brings it to your terminal.','Google'],

  ['rytr','Rytr','mkt','https://rytr.me','Quick AI copy for emails, ads and product descriptions'],
  ['writesonic','Writesonic','mkt','https://writesonic.com','Long-form blog articles with built-in SEO research'],
  ['taplio','Taplio','mkt','https://taplio.com','Write, schedule and grow on LinkedIn'],
  ['typefully','Typefully','mkt','https://typefully.com','Draft and schedule threads for X, LinkedIn and Threads'],
  ['ahrefs','Ahrefs','mkt','https://ahrefs.com','Keyword research, backlinks and competitor SEO'],
  ['surfer','Surfer SEO','mkt','https://surferseo.com','Score and optimize articles to rank on Google'],
  ['beehiiv','Beehiiv','mkt','https://www.beehiiv.com','Newsletter platform with AI writing and growth tools'],
  ['grammarly','Grammarly','mkt','https://www.grammarly.com','Fix grammar, tone and clarity everywhere you type'],
  ['adcreative','AdCreative','mkt','https://www.adcreative.ai','Generate ad banners and creatives that convert'],
  ['hubspot','HubSpot','mkt','https://www.hubspot.com','All-in-one marketing hub: email, landing pages, CRM'],

  ['apollo','Apollo','sales','https://www.apollo.io','B2B contact database plus email sequences'],
  ['salesnav','Sales Navigator','sales','https://business.linkedin.com/sales-solutions/sales-navigator','Find and track decision-makers on LinkedIn'],
  ['seamless','Seamless.AI','sales','https://seamless.ai','Real-time search for verified emails and phone numbers'],
  ['instantly','Instantly AI','sales','https://instantly.ai','Cold email at scale with warm-up and deliverability'],
  ['superhuman','Superhuman','sales','https://superhuman.com','The fastest email client, with AI replies'],
  ['drippi','Drippi AI','sales','https://drippi.ai','Personalized cold DMs and outreach on X'],
  ['clay','Clay','sales','https://www.clay.com','Enrich leads from 100+ data sources and automate research'],
  ['klenty','Klenty','sales','https://www.klenty.com','Multichannel sales cadences: email, calls, LinkedIn'],
  ['pipedrive','Pipedrive','sales','https://www.pipedrive.com','Visual deal pipeline CRM for small sales teams'],
  ['hubspotcrm','HubSpot CRM','sales','https://www.hubspot.com/products/crm','Free CRM to track contacts, deals and tasks'],

  ['midjourney','Midjourney','design','https://www.midjourney.com','Stunning, artistic images from a text prompt'],
  ['ideogram','Ideogram','design','https://ideogram.ai','Image generation that gets text and typography right'],
  ['canva','Canva','design','https://www.canva.com','Design anything: social posts, docs, slides, with Magic AI'],
  ['looka','Looka','design','https://looka.com','AI logo maker and full brand kit'],
  ['leonardo','Leonardo AI','design','https://leonardo.ai','Image generation with fine control, great for product art'],
  ['msdesigner','Microsoft Designer','design','https://designer.microsoft.com','Free AI graphics for posts, invites and cards'],
  ['firefly','Adobe Firefly','design','https://firefly.adobe.com','Commercially safe image generation and editing'],
  ['gamma','Gamma','design','https://gamma.app','Turn a prompt or doc into a polished presentation'],
  ['decktopus','Decktopus AI','design','https://www.decktopus.com','Pitch decks generated in minutes'],
  ['dreamina','Dreamina','design','https://dreamina.capcut.com','Images, posters and short videos from CapCut’s creative AI','ByteDance'],
  ['figmamake','Figma Make','design','https://www.figma.com/make/','Prompt a working prototype right inside Figma','Figma'],
  ['uizard','Uizard','design','https://uizard.io','Mock up app and web UIs from text or sketches'],

  ['veed','Veed','video','https://www.veed.io','Browser video editor with auto subtitles'],
  ['descript','Descript','video','https://www.descript.com','Edit video and podcasts by editing the transcript'],
  ['invideo','Invideo','video','https://invideo.io','Turn a script or idea into a finished video'],
  ['synthesia','Synthesia','video','https://www.synthesia.io','AI presenter videos for training, in 140+ languages'],
  ['runway','Runway','video','https://runwayml.com','Generate and edit video with cutting-edge AI'],
  ['kling','Kling','video','https://klingai.com','Realistic text-to-video and image-to-video clips','Kuaishou'],
  ['pictory','Pictory','video','https://pictory.ai','Turn blog posts and long videos into short clips'],
  ['heygen','HeyGen','video','https://www.heygen.com','Talking avatars and video translation with lip-sync'],
  ['loom','Loom','video','https://www.loom.com','Record your screen and share async video messages'],
  ['hailuo','Hailuo AI','video','https://hailuoai.video','Cinematic text-to-video and image-to-video clips','MiniMax'],
  ['flow','Google Flow','video','https://labs.google/flow/about','Film-quality clips with sound from Google\u2019s Veo model','Google'],
  ['guidde','Guidde','video','https://www.guidde.com','Auto-generate how-to guides and tutorial videos'],

  ['notion','Notion','prod','https://www.notion.so','Docs, wikis and projects with a built-in AI assistant'],
  ['clickup','ClickUp','prod','https://clickup.com','Tasks, docs and goals in one project workspace'],
  ['granola','Granola','prod','https://www.granola.ai','Bot-free meeting notes: it listens on your laptop and cleans up your notes','Granola'],
  ['otter','Otter AI','prod','https://otter.ai','Live meeting transcripts, summaries and action items'],
  ['notebooklm','NotebookLM','prod','https://notebooklm.google','Upload sources, get answers, summaries and audio overviews'],
  ['calendly','Calendly','prod','https://calendly.com','Share a link, let people book time with you'],
  ['zapier','Zapier','prod','https://zapier.com','Connect thousands of apps and automate workflows with AI'],
  ['motion','Motion','prod','https://www.usemotion.com','AI planner that auto-schedules tasks into your calendar'],
  ['gworkspace','Google Workspace','prod','https://workspace.google.com','Gmail, Docs, Sheets and Meet with Gemini built in'],
  ['trello','Trello','prod','https://trello.com','Simple kanban boards for teams and personal to-dos'],
  ['monday','Monday','prod','https://monday.com','Flexible work OS for projects, CRM and ops'],

  ['cursor','Cursor','code','https://cursor.com','AI code editor that runs several coding agents in parallel'],
  ['lovable','Lovable','code','https://lovable.dev','Describe an app, get a working full-stack web app'],
  ['windsurf','Windsurf','code','https://windsurf.com','Agentic IDE that plans and writes code with you'],
  ['v0','v0','code','https://v0.app','Vercel\u2019s builder that turns prompts into React apps you can deploy','Vercel'],
  ['devin','Devin','code','https://devin.ai','Autonomous software engineer that takes tickets and ships pull requests','Cognition'],
  ['bubble','Bubble','code','https://bubble.io','Visual no-code builder for real web apps'],
  ['bolt','Bolt','code','https://bolt.new','Prompt, run and deploy full-stack apps in the browser'],
  ['replit','Replit','code','https://replit.com','Cloud IDE plus an agent that builds and hosts apps'],
  ['copilot','GitHub Copilot','code','https://github.com/features/copilot','AI pair programmer inside your editor and GitHub'],
  ['vscode','VS Code','code','https://code.visualstudio.com','The free editor most AI coding extensions run in'],
  ['cline','Cline','code','https://cline.bot','Open-source coding agent that runs inside VS Code'],
  ['trae','Trae','code','https://www.trae.ai','Free AI IDE with a built-in builder agent','ByteDance'],

    ['mscopilot','Microsoft Copilot','assist','https://copilot.microsoft.com','AI help across Windows, Edge and Microsoft 365 apps','Microsoft'],
  ['grok','Grok','assist','https://grok.com','xAI\u2019s assistant with real-time answers from X and the web','xAI'],
  ['deepseek','DeepSeek','assist','https://www.deepseek.com','Top reasoning model for math, code and logic, free to chat','DeepSeek'],
  ['qwen','Qwen','assist','https://chat.qwen.ai','Alibaba’s open models for chat, coding, images and long documents','Alibaba'],
  ['kimi','Kimi','assist','https://www.kimi.com','Reads very long files and web pages, with agent and slide modes','Moonshot AI'],
  ['doubao','Doubao','assist','https://www.doubao.com','Popular all-round assistant for chat, writing and images','ByteDance'],
  ['zai','Z.ai (GLM)','assist','https://chat.z.ai','GLM models for chat, coding and building slides or web pages','Zhipu AI'],
  ['minimax','MiniMax','assist','https://www.minimax.io','Agent, voice and text models with very long context','MiniMax'],
  ['yuanbao','Yuanbao','assist','https://yuanbao.tencent.com','Tencent assistant that searches WeChat articles and the web','Tencent'],
  ['ernie','ERNIE Bot','assist','https://yiyan.baidu.com','Baidu’s assistant with built-in search and writing','Baidu'],

  ['perplexity','Perplexity','agent','https://www.perplexity.ai','Answer engine that searches the web and cites every source','Perplexity'],
  ['comet','Comet','agent','https://www.perplexity.ai/comet','Free AI browser that researches across tabs and does tasks for you','Perplexity'],
  ['dia','Dia','agent','https://www.diabrowser.com','Chat with your open tabs and run reusable AI skills in the browser','The Browser Company'],
  ['manus','Manus','agent','https://manus.im','Give it a goal and it plans, browses and delivers reports, slides or apps','Manus'],
  ['genspark','Genspark','agent','https://www.genspark.ai','Agent for cross-checked research briefs, sheets and slides','Genspark'],

  ['elevenlabs','ElevenLabs','audio','https://elevenlabs.io','Lifelike voiceovers, dubbing and voice agents in dozens of languages','ElevenLabs'],
  ['suno','Suno','audio','https://suno.com','Write a prompt, get a full song with vocals','Suno'],
  ['udio','Udio','audio','https://www.udio.com','High-fidelity AI music on a licensed platform','Udio'],
  ['murf','Murf','audio','https://murf.ai','Studio voiceovers for training, ads and explainers','Murf'],
  ['krisp','Krisp','audio','https://krisp.ai','Removes background noise and echo from any call','Krisp'],
  ['wispr','Wispr Flow','audio','https://wisprflow.ai','Speak instead of type: clean, formatted text in any app','Wispr']
];

// Each row becomes { id, name, cat, url, blurb, maker, host }
export const TOOLS = TOOL_ROWS.map(([id, name, cat, url, blurb, maker]) => ({
  id, name, cat, url, blurb, maker,
  host: url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')
}));

// Extra product links shown on the three big cards.
export const KING_LINKS = {
  claude: [['Desktop app', 'https://claude.ai/download'], ['Claude Code', 'https://claude.com/product/claude-code'], ['Open in browser', 'https://claude.ai']],
  chatgpt: [['Desktop app', 'https://openai.com/chatgpt/download'], ['Codex', 'https://openai.com/codex'], ['Open in browser', 'https://chatgpt.com']],
  gemini: [['Open Gemini', 'https://gemini.google.com'], ['Gemini CLI', 'https://github.com/google-gemini/gemini-cli'], ['AI Studio', 'https://aistudio.google.com']]
};

// Tasks list tools in recommended order: the first one is the best first pick.
export const TASKS = [
  { id: 'ask', cat: 'king', label: 'Ask anything, get help fast', tools: ['claude','chatgpt','gemini','deepseek','grok'] },
  { id: 'analyze', cat: 'king', label: 'Analyze a file or spreadsheet', tools: ['claude','chatgpt','kimi','notebooklm'] },
  { id: 'agent-code', cat: 'king', label: 'Let an AI agent build it', tools: ['claude','chatgpt','devin','cursor','cline'] },
  { id: 'write', cat: 'mkt', label: 'Write blogs & copy', tools: ['claude','writesonic','rytr','grammarly'] },
  { id: 'seo', cat: 'mkt', label: 'Rank on Google', tools: ['ahrefs','surfer','writesonic'] },
  { id: 'social', cat: 'mkt', label: 'Grow on LinkedIn / X', tools: ['taplio','typefully','canva'] },
  { id: 'newsletter', cat: 'mkt', label: 'Send a newsletter', tools: ['beehiiv','hubspot'] },
  { id: 'ads', cat: 'mkt', label: 'Make ad creatives', tools: ['adcreative','canva','msdesigner'] },
  { id: 'leads', cat: 'sales', label: 'Find leads & contacts', tools: ['apollo','salesnav','seamless','clay'] },
  { id: 'outreach', cat: 'sales', label: 'Cold email & outreach', tools: ['instantly','apollo','klenty','drippi'] },
  { id: 'crm', cat: 'sales', label: 'Track deals (CRM)', tools: ['hubspotcrm','pipedrive','monday'] },
  { id: 'inbox', cat: 'sales', label: 'Clear my inbox fast', tools: ['superhuman','gworkspace'] },
  { id: 'images', cat: 'design', label: 'Generate images', tools: ['midjourney','gemini','ideogram','chatgpt','leonardo','dreamina'] },
  { id: 'brand', cat: 'design', label: 'Logo & brand kit', tools: ['looka','ideogram','canva'] },
  { id: 'slides', cat: 'design', label: 'Build a presentation', tools: ['gamma','decktopus','kimi','canva'] },
  { id: 'social-graphics', cat: 'design', label: 'Social media graphics', tools: ['canva','msdesigner','adcreative'] },
  { id: 'uimock', cat: 'design', label: 'Mock up an app screen', tools: ['figmamake','uizard','v0','lovable'] },
  { id: 'edit', cat: 'video', label: 'Edit video or podcast', tools: ['descript','veed','invideo'] },
  { id: 'avatar', cat: 'video', label: 'AI presenter / avatar', tools: ['heygen','synthesia'] },
  { id: 'genvideo', cat: 'video', label: 'Video from a prompt', tools: ['flow','kling','runway','hailuo'] },
  { id: 'shorts', cat: 'video', label: 'Clips from long content', tools: ['pictory','descript','veed'] },
  { id: 'screen', cat: 'video', label: 'Screen recording & how-tos', tools: ['loom','guidde','descript'] },
  { id: 'meetings', cat: 'prod', label: 'Meeting notes', tools: ['granola','otter','gworkspace'] },
  { id: 'research', cat: 'prod', label: 'Summarize docs & research', tools: ['claude','notebooklm','chatgpt','kimi'] },
  { id: 'schedule', cat: 'prod', label: 'Plan my day & book meetings', tools: ['motion','calendly','gworkspace'] },
  { id: 'projects', cat: 'prod', label: 'Manage team projects', tools: ['clickup','monday','notion','trello'] },
  { id: 'automate', cat: 'prod', label: 'Automate repetitive work', tools: ['zapier','clay','monday'] },
  { id: 'nocode', cat: 'code', label: 'Build an app without code', tools: ['lovable','bolt','v0','bubble','replit'] },
  { id: 'code', cat: 'code', label: 'Write & debug code', tools: ['claude','chatgpt','cursor','copilot','windsurf','cline'] },
  { id: 'learncode', cat: 'code', label: 'Start coding for free', tools: ['vscode','replit','trae','cline'] },
  { id: 'budget', cat: 'assist', label: 'Strong free models', tools: ['deepseek','qwen','zai','doubao'] },
  { id: 'longdoc', cat: 'assist', label: 'Read very long documents', tools: ['kimi','qwen','minimax'] },
  { id: 'searchweb', cat: 'assist', label: 'Search the web with AI', tools: ['perplexity','gemini','grok','yuanbao'] },
  { id: 'office', cat: 'assist', label: 'AI inside Office & Gmail', tools: ['mscopilot','gemini','gworkspace'] },
  { id: 'slides-web', cat: 'assist', label: 'Turn a prompt into slides or a site', tools: ['zai','kimi','gamma'] },
  { id: 'deepresearch', cat: 'agent', label: 'Deep research with sources', tools: ['perplexity','genspark','claude','chatgpt'] },
  { id: 'delegate', cat: 'agent', label: 'Hand off a whole task', tools: ['manus','genspark','claude','chatgpt'] },
  { id: 'browse', cat: 'agent', label: 'Browse with an AI copilot', tools: ['comet','dia'] },
  { id: 'voiceover', cat: 'audio', label: 'Make a voiceover', tools: ['elevenlabs','murf','heygen'] },
  { id: 'music', cat: 'audio', label: 'Create a song or jingle', tools: ['suno','udio','elevenlabs'] },
  { id: 'cleanaudio', cat: 'audio', label: 'Clean up call audio', tools: ['krisp','descript'] },
  { id: 'dictate', cat: 'audio', label: 'Type with your voice', tools: ['wispr','granola'] }
];

export const byId = Object.fromEntries(TOOLS.map(t => [t.id, t]));
export const catById = Object.fromEntries(CATS.map(c => [c.id, c]));
export const taskById = Object.fromEntries(TASKS.map(t => [t.id, t]));
export const toolsIn = catId => TOOLS.filter(t => t.cat === catId);
export const tasksFor = toolId => TASKS.filter(t => t.tools.includes(toolId));
