package org.modeldeck.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gemini/api")
@CrossOrigin("*")
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
            String errorMsg = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
            if (errorMsg.contains("quota") || errorMsg.contains("limit") || errorMsg.contains("503") || errorMsg.contains("demand") || errorMsg.contains("exhausted")) {
                return ResponseEntity.ok("⚠️ Free limit completed or high demand. Please try again later.");
            }
            return ResponseEntity.ok("⚠️ Free limit completed or service temporarily busy.");
        }
    }
}
