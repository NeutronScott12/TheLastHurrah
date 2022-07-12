package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"lasthurrah/graph/generated"
	"lasthurrah/graph/model"
	"lasthurrah/prisma/db"
)

func (r *mutationResolver) CreateComment(ctx context.Context, createCommentInput model.CreateCommentInput) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) CreateReplyComment(ctx context.Context, createReplyCommentInput model.CreateReplyCommentInput) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) UpdateComment(ctx context.Context, updateCommentInput model.UpdateCommentInput) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) DeleteComment(ctx context.Context, commentID string) (*model.StandardResponseModel, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) DeleteManyComments(ctx context.Context, deleteManyCommentsInput model.DeleteManyCommentsInput) (*model.StandardResponseModel, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) ChangeCommentSettings(ctx context.Context, changeCommentSettingsInput model.ChangeCommentSettingsInput) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) UpVoteComment(ctx context.Context, commentID string) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) DownVoteComment(ctx context.Context, commentID string) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) CreateReport(ctx context.Context, createReportInput model.CreateReportInput) (*model.StandardResponseModel, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) ApproveComments(ctx context.Context, approveCommentsInput model.ApproveCommentsInput) (*model.StandardResponseModel, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) FetchCommentsByThreadID(ctx context.Context, fetchCommentByThreadIDInput model.FetchCommentByThreadIDInput) (*model.FetchCommentByThreadIDResponse, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) FetchCommentsByApplicationID(ctx context.Context, fetchCommentsByApplicationID model.FetchCommentsByApplicationIDInput) (*model.FetchCommentsByApplicationID, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) FetchCommentsByApplicationShortName(ctx context.Context, fetchCommentsByApplicationShortNameInput model.FetchCommentsByApplicationShortNameInput) (*model.FetchCommentByApplicationName, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) FetchComments(ctx context.Context) (*model.FetchAllComments, error) {
	client := db.NewClient()

	err := client.Connect()

	if err != nil {
		panic(fmt.Errorf("error connecting to Prisma: %w", err))
	}

	defer func() {
		err := client.Disconnect()

		if err != nil {
			panic(fmt.Errorf("error disconnecting to Prisma: %w", err))
		}
	}()

	comments, err := client.Comment.FindMany().Exec(ctx)

	if err != nil {
		panic(fmt.Errorf("error disconnecting to Prisma: %w", err))
	}

	// fmt.Printf("comments %+v", comments)

	responseComments := make([]*model.CommentModel, len(comments))
	for _, s := range comments {
		comment := model.CommentModel{
			ID: s.ID,
		}

		responseComments = append(responseComments, &comment)
	}

	response := &model.FetchAllComments{
		CommentsCount: 1,
		Comments:      responseComments,
	}

	fmt.Printf("response &v", response)

	return response, nil
	// panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) FetchCommentAndVoteCount(ctx context.Context, fetchCommentAndVoteCountInput model.FetchCommentAndVoteCountInput) (*model.CommentAndVoteCountEntity, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
