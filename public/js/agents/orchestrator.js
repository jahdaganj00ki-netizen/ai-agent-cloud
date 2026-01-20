import { BaseAgent } from './base.js';

export class Orchestrator extends BaseAgent {
    constructor() {
        super('Project Manager', 'Orchestrator');
        this.agents = {};
        this.projectData = {
            request: '',
            plan: [],
            files: {},
            history: [],
            status: 'idle'
        };
    }

    registerAgent(name, agent) {
        this.agents[name] = agent;
    }

    async process(request) {
        this.projectData.request = request;
        this.updateUI('Project Manager', 'Analyzing request...');

        const analysisPrompt = `You are the Project Manager of an autonomous AI coding agent system.
        Analyze the user request: "${request}"
        Create a detailed step-by-step implementation plan.
        Output only a JSON array of steps. Each step should have:
        - "id": unique identifier
        - "agent": which agent should handle it (Research, Planning, CodeGeneration, CodeReview, Debugging, Test, Security, UIUX, Database, Deployment, Documentation)
        - "description": what to do`;

        const planResponse = await this.chat(analysisPrompt);
        try {
            const jsonStr = planResponse.match(/\[.*\]/s)[0];
            this.projectData.plan = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse plan:", planResponse);
            throw new Error("Failed to create plan");
        }

        this.updateUI('Project Manager', 'Plan created. Executing steps...');

        for (const step of this.projectData.plan) {
            const agent = this.agents[step.agent];
            if (agent) {
                this.updateUI(step.agent, `Working on: ${step.description}`);
                const result = await agent.execute(step, this.projectData);
                this.projectData.history.push({ step, result });
                this.updateUI(step.agent, 'Done');
            }
        }

        this.updateUI('Project Manager', 'Project complete!');
        return "Task finished successfully.";
    }

    updateUI(agentName, status) {
        const event = new CustomEvent('agent-update', { detail: { agentName, status } });
        window.dispatchEvent(event);
    }
}
