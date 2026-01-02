package org.project.fintrack.exceptions;

import java.time.Instant;
import java.util.Map;

public class ErrorResponse {
    public Instant timestamp = Instant.now();
    public int status;
    public String error;
    public String code;
    public String message;
    public String path;
    public String traceId;
    public Map<String, Object> details; // e.g., field validation errors

    public ErrorResponse status(int s){ this.status=s; return this; }
    public ErrorResponse error(String e){ this.error=e; return this; }
    public ErrorResponse code(String c){ this.code=c; return this; }
    public ErrorResponse message(String m){ this.message=m; return this; }
    public ErrorResponse path(String p){ this.path=p; return this; }
    public ErrorResponse traceId(String t){ this.traceId=t; return this; }
    public ErrorResponse details(Map<String,Object> d){ this.details=d; return this; }
}