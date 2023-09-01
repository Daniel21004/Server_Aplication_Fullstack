package com.example.server.service;

import com.example.server.domain.Server;

import java.io.IOException;
import java.util.Collection;
import java.util.Optional;

public interface ServerService {
    Server createServer(Server server);
    Server pingServer(String ipAddress) throws IOException;
    Collection<Server> getAllServersByLimit(int limit);
    Optional<Server> getServer(Long id);
    Server updateServer(Server server); // The ID is in "Server" object
    Boolean deleteServer(Long id);
}
