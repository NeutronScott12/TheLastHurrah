package service

type DatabaseService struct{}

// func initialise() (*db.PrismaClient, error) {
//     client := db.NewClient()

//     err := client.Connect()

//     if err != nil {
//         panic(fmt.Errorf("Error connecting to Prisma: %w", err))
//     }

//     defer func() {
//         err := client.Disconnect()

//         if err != nil {
//             panic(fmt.Errorf("Error disconnecting to Prisma: %w", err))
//         }
//     }()

//     return client, nil
// }
