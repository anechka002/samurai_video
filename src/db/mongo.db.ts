import {MongoClient, Db, Collection} from "mongodb";
import {SETTINGS} from "../core/settings/settings";
import {Video} from "../videos/types/video";

const VIDEO_COLLECTION = 'videos'

export let client: MongoClient;
export let videoCollection: Collection<Video>

export async function runDB (url: string): Promise<void> {
  client = new MongoClient(url);

  try {
    await client.connect();

    const db: Db = client.db(SETTINGS.DB_NAME);
    await db.command({ping: 1})


    videoCollection = db.collection(VIDEO_COLLECTION);

    console.log('✅ Connected to the database');
  } catch (err) {
    await client.close();
    throw new Error(`❌ Database not connected: ${err}`);
  }
}