import { preferences } from "@raycast/api";
import fetch, { Headers } from "node-fetch";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export enum DeploymentState {
  ready,
  failed,
  deploying,
}

export interface Deployment {
  project: string;
  state: DeploymentState;
  time: string;
}

export async function fetchDeployments(): Promise<Deployment[]> {
  dayjs.extend(relativeTime);

  const headers = new Headers({
    Authorization: "Bearer " + preferences.token.value,
  });
  const apiURL = "https://api.vercel.com/";

  // Getting username
  let response = await fetch(apiURL + "www/user", {
    method: "get",
    headers: headers,
  });
  let json = await response.json();
  const username = json.user.username;

  // Getting deployments made by the user
  response = await fetch(apiURL + "v8/projects", {
    method: "get",
    headers: headers,
  });
  json = await response.json();
  const deployments: Deployment[] = [];
  for (const project of json.projects) {
    for (const deployment of project.latestDeployments) {
      if (deployment.creator.username === username) {
        let state: DeploymentState;
        switch (deployment.readyState.toUpperCase()) {
          case "READY":
            state = DeploymentState.ready;
            break;
          case "QUEUED" || "BUILDING":
            state = DeploymentState.deploying;
            break;
          default:
            state = DeploymentState.failed;
            break;
        }
        deployments.push({
          project: project.name,
          state: state,
          time: dayjs(deployment.createdAt).fromNow(),
        });
        break;
      }
    }
  }
  return deployments;
}
