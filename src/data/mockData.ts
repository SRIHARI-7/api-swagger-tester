
import { ApiResponse } from "../types/api";

export const mockApiData: ApiResponse = {
  endpoints: [
    {
      id: 'e39b3c2c-7986-4137-bdbe-5f15430b70ec',
      method: 'DELETE',
      summary: 'Delete user',
      description: 'This can only be done by the logged in user.',
      path: '/user/{username}',
      path_params: {
        username: {
          required: true,
          schema: {
            type: 'string',
          },
        },
      },
      request_body: {
        required: false,
      },
      responses: {},
    },
    {
      id: '7fe40bae-0d63-4836-9890-3c754eef4f4f',
      method: 'GET',
      summary: 'Finds Pets by status',
      description:
        'Multiple status values can be provided with comma separated strings',
      path: '/pet/findByStatus',
      queries: {
        status: {
          required: false,
          schema: {
            type: 'string',
            enum: ['available', 'pending', 'sold'],
          },
        },
      },
      request_body: {
        required: false,
      },
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['name', 'photoUrls'],
                  properties: {
                    category: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                        },
                        name: {
                          type: 'string',
                        },
                      },
                    },
                    id: {
                      type: 'integer',
                    },
                    name: {
                      type: 'string',
                    },
                    photoUrls: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    status: {
                      type: 'string',
                      description: 'pet status in the store',
                      enum: ['available', 'pending', 'sold'],
                    },
                    tags: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'integer',
                          },
                          name: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
              },
              examples: {
                example: {
                  value: null,
                },
              },
            },
          },
        },
      },
    },
    {
      id: 'ffc79843-04b8-4644-930a-88361e4821ef',
      method: 'GET',
      summary: 'Finds Pets by tags',
      description:
        'Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.',
      path: '/pet/findByTags',
      queries: {
        tags: {
          required: false,
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
      request_body: {
        required: false,
      },
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['name', 'photoUrls'],
                  properties: {
                    category: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                        },
                        name: {
                          type: 'string',
                        },
                      },
                    },
                    id: {
                      type: 'integer',
                    },
                    name: {
                      type: 'string',
                    },
                    photoUrls: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    status: {
                      type: 'string',
                      description: 'pet status in the store',
                      enum: ['available', 'pending', 'sold'],
                    },
                    tags: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'integer',
                          },
                          name: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
              },
              examples: {
                example: {
                  value: null,
                },
              },
            },
          },
        },
      },
    },
    {
      id: '8892a604-3591-49a7-855f-1628378035ac',
      method: 'GET',
      summary: 'Logs user into the system',
      description: 'Logs user into the system',
      path: '/user/login',
      queries: {
        password: {
          required: false,
          schema: {
            type: 'string',
          },
        },
        username: {
          required: false,
          schema: {
            type: 'string',
          },
        },
      },
      request_body: {
        required: false,
      },
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: {
                type: 'string',
              },
              examples: {
                example: {
                  value: null,
                },
              },
            },
            'text/plain': {
              schema: {
                type: 'string',
              },
              examples: {
                example: {
                  value: null,
                },
              },
            },
          },
        },
      },
    },
    {
      id: 'ee82b992-9e32-4191-b6c9-e69cd96c803a',
      method: 'GET',
      summary: 'Logs out Session',
      description: 'Logs out current logged in user session',
      path: '/user/logout',
      request_body: {
        required: false,
      },
      responses: {},
    },
    {
      id: '3cac872b-8dd5-4274-a041-a231784cc928',
      method: 'GET',
      summary: 'Get user by user name',
      description: 'Get user by user name',
      path: '/user/{username}',
      path_params: {
        username: {
          required: true,
          schema: {
            type: 'string',
          },
        },
      },
      request_body: {
        required: false,
      },
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                  },
                  firstName: {
                    type: 'string',
                  },
                  id: {
                    type: 'integer',
                  },
                  lastName: {
                    type: 'string',
                  },
                  password: {
                    type: 'string',
                  },
                  phone: {
                    type: 'string',
                  },
                  userStatus: {
                    type: 'integer',
                    description: 'User Status',
                  },
                  username: {
                    type: 'string',
                  },
                },
              },
              examples: {
                example: {
                  value: {
                    email: 'john@email.com',
                    firstName: 'John',
                    id: 10,
                    lastName: 'James',
                    password: '12345',
                    phone: '12345',
                    userStatus: 1,
                    username: 'theUser',
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: '7ebd79df-f266-43ce-b154-e691e6cd0c55',
      method: 'GET',
      summary: 'Get Users',
      path: '/users',
      request_body: {
        required: false,
      },
      responses: {},
    },
    {
      id: '86f6c80e-85be-4629-8c09-920cd9794d16',
      method: 'POST',
      summary: 'Create user',
      description: 'This can only be done by the logged in user.',
      path: '/user',
      request_body: {
        description: 'Created user object',
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                },
                firstName: {
                  type: 'string',
                },
                id: {
                  type: 'integer',
                },
                lastName: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
                phone: {
                  type: 'string',
                },
                userStatus: {
                  type: 'integer',
                  description: 'User Status',
                },
                username: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      responses: {
        default: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                  },
                  firstName: {
                    type: 'string',
                  },
                  id: {
                    type: 'integer',
                  },
                  lastName: {
                    type: 'string',
                  },
                  password: {
                    type: 'string',
                  },
                  phone: {
                    type: 'string',
                  },
                  userStatus: {
                    type: 'integer',
                    description: 'User Status',
                  },
                  username: {
                    type: 'string',
                  },
                },
              },
              examples: {
                example: {
                  value: {
                    email: 'john@email.com',
                    firstName: 'John',
                    id: 10,
                    lastName: 'James',
                    password: '12345',
                    phone: '12345',
                    userStatus: 1,
                    username: 'theUser',
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      id: 'cfd0300a-ecda-4065-abc4-35507ae4a655',
      method: 'PUT',
      summary: 'Update user',
      description: 'This can only be done by the logged in user.',
      path: '/user/{username}',
      path_params: {
        username: {
          required: true,
          schema: {
            type: 'string',
          },
        },
      },
      request_body: {
        description: 'Update an existent user in the store',
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                },
                firstName: {
                  type: 'string',
                },
                id: {
                  type: 'integer',
                },
                lastName: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
                phone: {
                  type: 'string',
                },
                userStatus: {
                  type: 'integer',
                  description: 'User Status',
                },
                username: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      responses: {},
    },
  ],
  page: {
    total_count: 9,
    page: 1,
    per_page: 10,
    total_pages: 1,
  },
};

// Group endpoints by base path
export const getGroupedEndpoints = () => {
  const endpointMap: Record<string, Endpoint[]> = {};
  
  mockApiData.endpoints.forEach(endpoint => {
    // Extract base path (e.g., /user, /pet)
    const basePath = '/' + endpoint.path.split('/')[1];
    
    if (!endpointMap[basePath]) {
      endpointMap[basePath] = [];
    }
    
    endpointMap[basePath].push(endpoint);
  });
  
  return Object.entries(endpointMap).map(([name, endpoints]) => ({
    name,
    endpoints,
  }));
};

// Mock API call
export const simulateApiRequest = async (
  endpoint: Endpoint, 
  params: RequestParams
): Promise<RequestResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Simulate response
  let responseData: any = {};
  let status = 200;
  
  // Check if there's an example response
  const responseKey = Object.keys(endpoint.responses)[0] || "200";
  const response = endpoint.responses[responseKey];
  
  if (response?.content?.['application/json']?.examples?.example?.value) {
    responseData = response.content['application/json'].examples.example.value;
  } else if (endpoint.path.includes('/user/')) {
    responseData = {
      username: params.pathParams.username || 'defaultUser',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      id: 123,
      status: 'active'
    };
  } else if (endpoint.path.includes('/pet/')) {
    responseData = [
      {
        id: 1,
        name: 'Doggie',
        category: { id: 1, name: 'Dogs' },
        photoUrls: ['https://example.com/dog.jpg'],
        tags: [{ id: 1, name: 'tag1' }],
        status: params.queryParams.status || 'available'
      }
    ];
  }
  
  return {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    data: responseData,
    headers: {
      'content-type': 'application/json',
      'x-rate-limit': '100',
      'server': 'FuseAPITest Mock Server'
    },
    time: Math.floor(Math.random() * 100) + 50 // Random time between 50-150ms
  };
};

export interface RequestResult {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  time: number;
}
