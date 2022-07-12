use diesel_derive_enum::DbEnum;

#[derive(DbEnum, Debug)]
pub enum ReportReason {
    DISAGREE,
    SPAM,
    Inappropriate,
    ThreateningContent,
    PrivateInformation
}

pub mod exports {
    pub use super::ReportReason;
}