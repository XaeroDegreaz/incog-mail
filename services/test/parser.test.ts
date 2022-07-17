import {simpleParser} from 'mailparser';
import {readFileSync} from 'fs';

describe( 'asd', () => {
  it( 'qweqe', async () => {
    const file = readFileSync( 'test/example.txt' )
    const parsed = await simpleParser( file );
    const i = 0;
  } )
} )
