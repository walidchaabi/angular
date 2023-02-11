package io.ServerApp.server.service;

import io.ServerApp.server.model.Server;

import java.io.IOException;
import java.util.Collection;

public interface ServerService {
    Server create(Server server);
    Server ping(String ipAddress) throws IOException;
    Collection<Server> List(int limit);
    Server get(Long id);
    Server update(Server server);
    Boolean delete(Long id);
}
