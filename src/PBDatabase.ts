//@ts-check
import SQLite3 from "sqlite3";

export class PBDatabase {

    private _db: SQLite3.Database;

    constructor (dbPath: string, onReady: (database: PBDatabase)=>void) {
        this._db = new SQLite3.Database(dbPath, (err)=>{
            if (err) console.log("DB Error:", err);
            onReady(this);
        });
    }

    public query (sql: string, ...params: any[]): Promise<any[]> {
        return new Promise(resolve => {
            this._db.all(sql, params, (err, rows)=>{
                if (err) console.log(err);
                resolve(rows);
            });
        });
    }
}
