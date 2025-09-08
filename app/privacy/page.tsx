// app/privacy/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl w-full space-y-8 rounded-lg shadow-lg p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 space-y-6 text-base leading-relaxed">
          <p>
            Your privacy is important to us. It is TenderHub policy to respect your privacy regarding any information we may collect from you across our website <Link href="/" className="text-blue-600 hover:underline">[Your Website URL]</Link>, and other sites we own and operate.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h3>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means with your knowledge and consent. We also let you know why we are collecting it and how it will be used.
          </p>
          <p>
            **Personal Information:** This may include your name email address company details contact information and payment information.
          </p>
          <p>
            **Usage Data:** We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device. This Usage Data may include information such as your computers Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">3. Disclosure of Data</h3>
          <p>
            We may disclose your Personal Data in the good faith belief that such action is necessary to:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>To comply with a legal obligation</li>
            <li>To protect and defend the rights or property of TenderHub</li>
            <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>To protect the personal safety of users of the Service or the public</li>
            <li>To protect against legal liability</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">4. Security of Data</h3>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">5. Your Data Protection Rights</h3>
          <p>
            Depending on your location, you may have the following data protection rights:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>The right to access update or to delete the information we have on you.</li>
            <li>The right to have your information rectified.</li>
            <li>The right to object to our processing of your Personal Data.</li>
            <li>The right to request the restriction of the processing of your personal information.</li>
            <li>The right to portability of your Personal Data.</li>
            <li>The right to withdraw consent.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">6. Links to Other Sites</h3>
          <p>
            Our Service may contain links to other sites that are not operated by us. If you click on a third party link you will be directed to that third party site. We strongly advise you to review the Privacy Policy of every site you visit.
          </p>
          <p>
            We have no control over and assume no responsibility for the content privacy policies or practices of any third party sites or services.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">7. Changes to This Privacy Policy</h3>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
