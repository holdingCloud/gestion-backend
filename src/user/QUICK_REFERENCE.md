# Error Handling Quick Reference

## Summary of Implementation

The user module now has comprehensive error handling with:

### ✅ Custom Exceptions (4 files)
- `UserNotFoundException` - 404 errors
- `UserAlreadyExistsException` - 409 duplicate errors  
- `InvalidRoleException` - 400 validation errors
- `index.ts` - barrel export

### ✅ Exception Filters (3 files)
- `PrismaExceptionFilter` - Database error handling
- `HttpExceptionFilter` - HTTP error formatting
- `index.ts` - barrel export

### ✅ Interceptors (2 files)
- `LoggingInterceptor` - Request/response logging
- `index.ts` - barrel export

### ✅ Enhanced Layers
- **Repository**: Try-catch blocks, validation, custom exceptions
- **Service**: Entity validation, structured logging
- **Controller**: Exception filters, logging interceptor, validation pipes

## File Structure
```
src/user/
├── exceptions/
│   ├── user-not-found.exception.ts
│   ├── user-already-exists.exception.ts
│   ├── invalid-role.exception.ts
│   └── index.ts
├── filters/
│   ├── prisma-exception.filter.ts
│   ├── http-exception.filter.ts
│   └── index.ts
├── interceptors/
│   ├── logging.interceptor.ts
│   └── index.ts
├── user.repository.ts (enhanced)
├── user.service.ts (enhanced)
├── user.controller.ts (enhanced)
└── ERROR_HANDLING.md (documentation)
```

## Error Response Examples

### 404 Not Found
```json
{
  "statusCode": 404,
  "timestamp": "2026-02-23T10:30:00.000Z",
  "message": "User with identifier '5' was not found",
  "error": "Not Found"
}
```

### 409 Conflict (Duplicate)
```json
{
  "statusCode": 409,
  "timestamp": "2026-02-23T10:30:00.000Z",
  "message": "User with email 'test@example.com' already exists",
  "error": "Conflict"
}
```

### 400 Bad Request (Invalid Role)
```json
{
  "statusCode": 400,
  "timestamp": "2026-02-23T10:30:00.000Z",
  "message": "Role with ID '999' does not exist or is invalid",
  "error": "Bad Request"
}
```

## Testing Commands

```bash
# Test successful creation
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"new@test.com","fullName":"Test User","password":"pass123","imagen":"img.jpg","rol":1}'

# Test duplicate email (409)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"existing@test.com","fullName":"Test User","password":"pass123","imagen":"img.jpg","rol":1}'

# Test invalid user ID (404)
curl http://localhost:3000/users/99999

# Test invalid role ID (400)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","fullName":"Test User","password":"pass123","imagen":"img.jpg","rol":99999}'

# Test invalid parameter (400)
curl http://localhost:3000/users/abc
```

## Clean Code Patterns Applied

✅ **SOLID Principles**
- Single Responsibility: Each class handles one concern
- Open/Closed: Easy to extend with new exceptions
- Dependency Inversion: Depends on abstractions

✅ **Error Handling Best Practices**
- Domain-specific exceptions
- Centralized error handling
- Consistent error responses
- No sensitive data leakage

✅ **Logging Strategy**
- Structured logging with context
- Different log levels (error, warn, log)
- Request timing metrics
- Stack traces for debugging

✅ **Type Safety**
- Proper TypeScript types
- Validation at boundaries
- Type guards for error checking

## Next Steps

To apply this pattern to other modules:
1. Copy `exceptions/`, `filters/`, `interceptors/` folders
2. Update exception messages for domain
3. Add try-catch to repository methods
4. Add validation to service methods
5. Add decorators to controller

## Key Benefits

🚀 **Production Ready**
- Graceful error handling
- Security (no DB errors exposed)
- Observability (detailed logs)

📊 **Developer Experience**
- Clear error messages
- Easy debugging
- Consistent patterns

🔧 **Maintainable**
- Easy to extend
- Reusable components
- Well documented
