package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"lasthurrah/graph/generated"
	"lasthurrah/graph/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// CreateComment is the resolver for the create_comment field.
func (r *mutationResolver) CreateComment(ctx context.Context, createCommentInput model.CreateCommentInput) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// CreateReplyComment is the resolver for the create_reply_comment field.
func (r *mutationResolver) CreateReplyComment(ctx context.Context, createReplyCommentInput model.CreateReplyCommentInput) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// UpdateComment is the resolver for the update_comment field.
func (r *mutationResolver) UpdateComment(ctx context.Context, updateCommentInput model.UpdateCommentInput) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// DeleteComment is the resolver for the delete_comment field.
func (r *mutationResolver) DeleteComment(ctx context.Context, commentID string) (*model.StandardResponseModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// DeleteManyComments is the resolver for the delete_many_comments field.
func (r *mutationResolver) DeleteManyComments(ctx context.Context, deleteManyCommentsInput model.DeleteManyCommentsInput) (*model.StandardResponseModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// ChangeCommentSettings is the resolver for the change_comment_settings field.
func (r *mutationResolver) ChangeCommentSettings(ctx context.Context, changeCommentSettingsInput model.ChangeCommentSettingsInput) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// UpVoteComment is the resolver for the up_vote_comment field.
func (r *mutationResolver) UpVoteComment(ctx context.Context, commentID string) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// DownVoteComment is the resolver for the down_vote_comment field.
func (r *mutationResolver) DownVoteComment(ctx context.Context, commentID string) (*model.CommentModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// CreateReport is the resolver for the create_report field.
func (r *mutationResolver) CreateReport(ctx context.Context, createReportInput model.CreateReportInput) (*model.StandardResponseModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// DeleteReportByID is the resolver for the delete_report_by_id field.
func (r *mutationResolver) DeleteReportByID(ctx context.Context, id string) (*model.StandardResponseModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// ApproveComments is the resolver for the approve_comments field.
func (r *mutationResolver) ApproveComments(ctx context.Context, approveCommentsInput model.ApproveCommentsInput) (*model.StandardResponseModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// FetchCommentsByThreadID is the resolver for the fetch_comments_by_thread_id field.
func (r *queryResolver) FetchCommentsByThreadID(ctx context.Context, fetchCommentByThreadIDInput model.FetchCommentByThreadIDInput) (*model.FetchCommentByThreadIDResponse, error) {
	panic(fmt.Errorf("not implemented"))
}

// FetchCommentsByApplicationID is the resolver for the fetch_comments_by_application_id field.
func (r *queryResolver) FetchCommentsByApplicationID(ctx context.Context, fetchCommentsByApplicationID model.FetchCommentsByApplicationIDInput) (*model.FetchCommentsByApplicationID, error) {
	panic(fmt.Errorf("not implemented"))
}

// FetchCommentsByApplicationShortName is the resolver for the fetch_comments_by_application_short_name field.
func (r *queryResolver) FetchCommentsByApplicationShortName(ctx context.Context, fetchCommentsByApplicationShortNameInput model.FetchCommentsByApplicationShortNameInput) (*model.FetchCommentByApplicationName, error) {
	panic(fmt.Errorf("not implemented"))
}

// FetchComments is the resolver for the fetch_comments field.
func (r *queryResolver) FetchComments(ctx context.Context) (*model.FetchAllComments, error) {
	dbURL := "postgresql://postgres:postgres@localhost:5436/thelasthurrah_comments"

    db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})

    if err != nil {
        panic(err)
    }

    result := db.Find(&[]model.CommentModel{})

    if result.Error != nil {
        panic(result.Error)
    }

    fmt.Println(result)

    

    return nil, nil
}

// FetchAllReports is the resolver for the fetch_all_reports field.
func (r *queryResolver) FetchAllReports(ctx context.Context) ([]*model.ReportModel, error) {
	panic(fmt.Errorf("not implemented"))
}

// FetchCommentStats is the resolver for the fetch_comment_stats field.
func (r *queryResolver) FetchCommentStats(ctx context.Context, fetchCommentStatsInput model.FetchCommentStatsInput) (*model.CommentStatsEntity, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }


