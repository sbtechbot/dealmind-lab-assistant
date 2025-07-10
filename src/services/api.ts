
const API_BASE_URL = 'http://localhost:8000';

interface ConversationEntry {
  id: string;
  title: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
  metadata: {
    intent: string;
    outcome: string;
    final_price?: number;
    business_type: string;
    complexity: "low" | "medium" | "high";
    tags: string[];
  };
  created_at: string;
  is_favorite: boolean;
}

interface TableData {
  id: string;
  headers: Array<{
    id: string;
    name: string;
    type: "text" | "number" | "select";
    options?: string[];
  }>;
  entries: Array<{
    id: string;
    data: Record<string, any>;
  }>;
  createdAt: string;
}

interface TrainedModel {
  id: string;
  name: string;
  accuracy: number;
  loss: number;
  trainingDate: string;
  status: "training" | "completed" | "failed";
}

export const api = {
  async getConversations(): Promise<ConversationEntry[]> {
    const response = await fetch(`${API_BASE_URL}/api/conversations`);
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return response.json();
  },

  async createConversation(conversation: Omit<ConversationEntry, 'id' | 'created_at'>): Promise<ConversationEntry> {
    const response = await fetch(`${API_BASE_URL}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversation),
    });
    if (!response.ok) throw new Error('Failed to create conversation');
    return response.json();
  },

  async updateConversation(id: string, conversation: ConversationEntry): Promise<ConversationEntry> {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversation),
    });
    if (!response.ok) throw new Error('Failed to update conversation');
    return response.json();
  },

  async deleteConversation(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete conversation');
  },

  async getTableData(): Promise<TableData[]> {
    const response = await fetch(`${API_BASE_URL}/api/table-data`);
    if (!response.ok) throw new Error('Failed to fetch table data');
    return response.json();
  },

  async saveTableData(data: Omit<TableData, 'id' | 'createdAt'>): Promise<TableData> {
    const response = await fetch(`${API_BASE_URL}/api/table-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save table data');
    return response.json();
  },

  async getTrainedModels(): Promise<TrainedModel[]> {
    const response = await fetch(`${API_BASE_URL}/api/models`);
    if (!response.ok) throw new Error('Failed to fetch trained models');
    return response.json();
  },

  async trainModel(config: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/models/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!response.ok) throw new Error('Failed to start training');
    return response.json();
  },

  async saveTrainedModel(model: Omit<TrainedModel, 'id' | 'trainingDate'>): Promise<TrainedModel> {
    const response = await fetch(`${API_BASE_URL}/api/models`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model),
    });
    if (!response.ok) throw new Error('Failed to save trained model');
    return response.json();
  },

  async exportData(dataType: string): Promise<{ data: any; filename: string }> {
    const response = await fetch(`${API_BASE_URL}/api/export/${dataType}`);
    if (!response.ok) throw new Error('Failed to export data');
    return response.json();
  },
};
