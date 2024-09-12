
import Qs from "querystring";
import { request } from "../utils";

export async function geiVoiceprintUserList(query) {
  return await request({
    url: "/voice/voiceprint/voiceprintList",
    method: "get",
    params: query,
  });
}

export async function addVoiceprint(body) {
  return await request({
    url: "/voice/voiceprint/voiceprintAdd",
    method: "post",
    data: body,
  });
}

export async function delVoiceprint(body) {
  return await request({
    url: `/voice/voiceprint/deleteById/${body}`,
    method: "DELETE",
  });
}

export async function getVoiceprintUSer(body) {
  return await request({
    url: "/voice/voiceprint/selectUserByVoiceprint",
    method: "post",
    data: body,
  });
}
