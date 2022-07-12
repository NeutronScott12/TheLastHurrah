package graph

import "lasthurrah/prisma/db"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	dbClient *db.PrismaClient
}
