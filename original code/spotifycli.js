import dbus from 'dbus-next';

const bus = dbus.sessionBus();
const client = 'spotify';

export function showVersion() {
  console.log('1.9.1');
}

export async function showStatus() {
  try {
    const metadata = await getSpotifyProperty('Metadata');
    const artist = metadata['xesam:artist'].join(', ');
    const title = metadata['xesam:title'];
    console.log(`${artist} - ${title}`);
  } catch (error) {
    console.error('Error fetching status:', error.message);
  }
}

export async function performSpotifyAction(action) {
  try {
    const player = await getSpotifyPlayer();
    await player[action]();
    console.log(`${action} action performed successfully.`);
  } catch (error) {
    console.error(`Error performing ${action}:`, error.message);
  }
}

async function getSpotifyPlayer() {
  const proxyObject = await bus.getProxyObject(
    `org.mpris.MediaPlayer2.${client}`,
    '/org/mpris/MediaPlayer2'
  );
  return proxyObject.getInterface('org.mpris.MediaPlayer2.Player');
}

async function getSpotifyProperty(property) {
  const proxyObject = await bus.getProxyObject(
    `org.mpris.MediaPlayer2.${client}`,
    '/org/mpris/MediaPlayer2'
  );
  const properties = proxyObject.getInterface('org.freedesktop.DBus.Properties');
  return properties.Get('org.mpris.MediaPlayer2.Player', property);
}
