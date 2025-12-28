export namespace ProposalInput {
    export class CreateProposalDto {
        type: string; // 'new_store'
        title: string;
        message: string;
        latitude?: number;
        longitude?: number;
    }
}
