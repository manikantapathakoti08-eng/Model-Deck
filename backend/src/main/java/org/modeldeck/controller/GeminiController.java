package org.modeldeck.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gemini/api")

public class GeminiController {

    private ChatClient chatClient;

    public GeminiController(GoogleGenAiChatModel chatModel) {
        this.chatClient = ChatClient.create(chatModel);
    }

    @PostMapping("/chat")
    public ResponseEntity<String> getAnswer(@RequestBody String message) {
        try{
        String response = chatClient
                .prompt(message)
                .call()
                .content();
        return ResponseEntity.ok(response);
        } catch (Throwable e) {
            e.printStackTrace();
            String cause = (e.getCause() != null) ? e.getCause().getMessage() : "Unknown cause";

            return ResponseEntity.status(500).body("Server error: " + cause);
        }
    }
}
