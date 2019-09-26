export default class ActiveRooms {
    private _rooms: Array<string>;

    constructor() {
        this._rooms = []
    }

    get rooms(): Array<string> {
        return this._rooms;
    }

    addRoom(chatUuid: string) {
        this._rooms.push(chatUuid);
    }

    deleteRoom(chatUuid: string) {
        const index: number = this._rooms.indexOf(chatUuid);
        this._rooms.splice(index, 1)
    }
}