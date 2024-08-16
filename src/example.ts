import SFXReader from ".";
import fs from 'fs';

async function start() {
	const sfx = new SFXReader("D:\\Games\\GTA San Andreas (Vanilla)");
	await sfx.load();
	
	const sound = sfx.getSoundEffect("SPC_GA", 209, 48);
	console.log({ sound });

	// It actually matches the export from SAAT!
	const wavBuf = sfx.toWAV(sound);

	fs.writeFileSync("test.wav", wavBuf);
}
start();