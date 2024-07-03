import { FacebookProvider, ShareButton } from 'react-facebook';

export default function ShareButtonExample() {
  return (
    <FacebookProvider appId="981312986521330">
      <ShareButton href="https://www.facebook.com/profile.php?id=61560236463968" className="my-classname">
        Share
      </ShareButton>
    </FacebookProvider>
  );
}