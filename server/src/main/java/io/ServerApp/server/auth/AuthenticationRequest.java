package io.ServerApp.server.auth;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String Email;
    private String password;

}
