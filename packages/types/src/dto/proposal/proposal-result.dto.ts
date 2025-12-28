export namespace ProposalResult {
    export class StoreInfoDto {
        id: number;
        name: string;

        constructor(id: number, name: string) {
            this.id = id;
            this.name = name;
        }
    }

    export class ProposalDto {
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        status: 'pending' | 'approved' | 'rejected';
        createdAt: Date;
        store?: StoreInfoDto | null;

        constructor(
            id: number,
            name: string,
            address: string,
            latitude: number,
            longitude: number,
            status: 'pending' | 'approved' | 'rejected',
            createdAt: Date,
            store?: StoreInfoDto | null
        ) {
            this.id = id;
            this.name = name;
            this.address = address;
            this.latitude = latitude;
            this.longitude = longitude;
            this.status = status;
            this.createdAt = createdAt;
            this.store = store;
        }
    }

    export class MyProposalsDto {
        items: ProposalDto[];
        total: number;
        page: number;
        size: number;

        constructor(items: ProposalDto[], total: number, page: number, size: number) {
            this.items = items;
            this.total = total;
            this.page = page;
            this.size = size;
        }
    }

    export class CreateProposalResultDto {
        id: number;
        status: 'pending';
        expGained: number;

        constructor(id: number, status: 'pending', expGained: number) {
            this.id = id;
            this.status = status;
            this.expGained = expGained;
        }
    }
}
