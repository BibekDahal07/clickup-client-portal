const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_API_URL = 'https://api.clickup.com/api/v2';

export interface ClickUpTask {
  id: string;
  name: string;
  description?: string;
  status: {
    status: string;
  };
  due_date?: number;
  priority?: {
    priority: string;
  };
  custom_fields?: Array<{
    name: string;
    value: any;
  }>;
  url: string;
}

export interface ClickUpList {
  id: string;
  name: string;
}

class ClickUpClient {
  private headers: HeadersInit;

  constructor() {
    this.headers = {
      'Authorization': CLICKUP_API_TOKEN!,
      'Content-Type': 'application/json',
    };
  }

  async makeRequest(endpoint: string): Promise<any> {
    const response = await fetch(`${CLICKUP_API_URL}${endpoint}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`ClickUp API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get all teams (workspaces)
  async getTeams(): Promise<any[]> {
    const data = await this.makeRequest('/team');
    return data.teams;
  }

  // Get all spaces in a team
  async getSpaces(teamId: string): Promise<any[]> {
    const data = await this.makeRequest(`/team/${teamId}/space?archived=false`);
    return data.spaces;
  }

  // Get all folders in a space
  async getFolders(spaceId: string): Promise<any[]> {
    const data = await this.makeRequest(`/space/${spaceId}/folder?archived=false`);
    return data.folders;
  }

  // Get all lists in a folder
  async getLists(folderId: string): Promise<ClickUpList[]> {
    const data = await this.makeRequest(`/folder/${folderId}/list?archived=false`);
    return data.lists;
  }

  // Get tasks from a list with optional custom field filtering
  async getTasks(listId: string, customFieldFilter?: { field: string; value: string }): Promise<ClickUpTask[]> {
    let endpoint = `/list/${listId}/task?archived=false&include_closed=true`;
    
    if (customFieldFilter) {
      endpoint += `&custom_fields=[{"field_id":"${customFieldFilter.field}","operator":"=","value":"${customFieldFilter.value}"}]`;
    }

    const data = await this.makeRequest(endpoint);
    return data.tasks;
  }

  // Get task details
  async getTask(taskId: string): Promise<ClickUpTask> {
    return await this.makeRequest(`/task/${taskId}`);
  }
}

export const clickup = new ClickUpClient();