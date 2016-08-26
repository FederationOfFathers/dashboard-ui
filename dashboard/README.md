Check out the [CLI](https://github.com/aurelia/cli) for more details.  

## Api's

#### groups
    "/api/v0/groups": [
      {
        "AdminParams": null,
        "Description": "List all visible groups. List all groups for Admins",
        "Method": "GET",
        "OptionalParams": null,
        "RequiredParams": null
      }
    ]  
    "/api/v0/groups/{groupID}/join": [
      {
        "AdminParams": null,
        "Description": "Join the group specified by groupID (see /api/v0/groups) if it is marked visible",
        "Method": "GET",
        "OptionalParams": null,
        "RequiredParams": null
      }
    ]  
    "/api/v0/groups/{groupID}/visibility": [
      {
        "AdminParams": [
          {
            "Description": "Whether or not the group should be visible",
            "Name": "visible",
            "Type": "string",
            "Values": [
              "true",
              "false"
            ]
          }
        ],
        "Description": "Set the visibility of the group",
        "Method": "PUT",
        "OptionalParams": null,
        "RequiredParams": null
      }
    ]  

#### user
    "/api/v0/login": [
      {
        "AdminParams": null,
        "Description": "Logs a user into the API. Linked to from slack messages for users",
        "Method": "GET",
        "OptionalParams": null,
        "RequiredParams": null
      }
    ]  
    "/api/v0/logout": [
      {
        "AdminParams": null,
        "Description": "Log a user out of the API.",
        "Method": "GET",
        "OptionalParams": null,
        "RequiredParams": null
      }
    ]  
    "/api/v0/ping": [
      {
        "AdminParams": null,
        "Description": "Make sure the user is logged in and return information about their current state",
        "Method": "GET",
        "OptionalParams": null,
        "RequiredParams": null
      }
    ]  

#### streams
    "/api/v0/streams": [
      {
        "AdminParams": null,
        "Description": "List all registered streams",
        "Method": "GET",
        "OptionalParams": null,
        "RequiredParams": null
      },
      {
        "AdminParams": [
          {
            "Description": "The slack UserID to assign the stream to",
            "Name": "userID",
            "Type": "string",
            "Values": null
          }
        ],
        "Description": "Add a stream",
        "Method": "POST",
        "OptionalParams": null,
        "RequiredParams": [
          {
            "Description": "Which service the stream streams from",
            "Name": "kind",
            "Type": "string",
            "Values": [
              "twitch",
              "youtube"
            ]
          },
          {
            "Description": "The identifier on the streaming service for the stream",
            "Name": "id",
            "Type": "string",
            "Values": null
          }
        ]
      }
    ]  
    "/api/v0/streams/{key}": [
      {
        "AdminParams": null,
        "Description": "Get details for a specific stream. Probably not used",
        "Method": "GET",
        "OptionalParams": null,
        "RequiredParams": null
      },
      {
        "AdminParams": null,
        "Description": "Delete a stream if the user is the owner or an admin",
        "Method": "DELETE",
        "OptionalParams": null,
        "RequiredParams": null
      }
    ]
  