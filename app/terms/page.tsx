// app/terms/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl w-full space-y-8 rounded-lg shadow-lg p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 space-y-6 text-base leading-relaxed">
          <p>
            Welcome to TenderHub! These terms and conditions outline the rules and regulations for the use of TenderHub's Website, located at [Your Website URL].
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use TenderHub if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">1. Intellectual Property Rights</h3>
          <p>
            Other than content you own, which you may have opted to include on this Website, under these Terms, TenderHub and/or its licensors own all rights to the intellectual property and material contained in this Website, and all such rights are reserved. You are granted a limited license only, subject to the restrictions provided in these Terms, for purposes of viewing the material contained on this Website.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">2. Restrictions</h3>
          <p>You are expressly restricted from all of the following:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>publishing any Website material in any other media;</li>
            <li>selling, sublicensing, and/or otherwise commercializing any Website material;</li>
            <li>publicly performing and/or showing any Website material;</li>
            <li>using this Website in any way that is or may be damaging to this Website;</li>
            <li>using this Website in any way that impacts user access to this Website;</li>
            <li>using this Website contrary to applicable laws and regulations, or in a way that causes, or may cause, harm to the Website, or to any person or business entity;</li>
            <li>engaging in any data mining, data harvesting, data extracting, or any other similar activity in relation to this Website, or while using this Website;</li>
            <li>using this Website to engage in any advertising or marketing.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">3. Your Content</h3>
          <p>
            In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video, text, images or other material you choose to display on this Website. With respect to Your Content, by displaying it, you grant TenderHub a non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
          </p>
          <p>
            Your Content must be your own and must not be infringing on any third-party’s rights. TenderHub reserves the right to remove any of Your Content from this Website at any time, and for any reason, without notice.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">4. No warranties</h3>
          <p>
            This Website is provided "as is," with all faults, and TenderHub expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as providing consult or advice to you.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">5. Limitation of liability</h3>
          <p>
            In no event shall TenderHub, nor any of its officers, directors and employees, be liable to you for anything arising out of or in any way connected with your use of this Website whether such liability is under contract, tort or otherwise, and TenderHub, including its officers, directors and employees shall not be liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">6. Indemnification</h3>
          <p>
            You hereby indemnify to the fullest extent TenderHub from and against any and all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">7. Severability</h3>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid under any applicable law, such unenforceability or invalidity shall not render these Terms unenforceable or invalid as a whole, and such provisions shall be deleted without affecting the remaining provisions herein.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">8. Variation of Terms</h3>
          <p>
            TenderHub is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review such Terms on a regular basis to ensure you understand all terms and conditions governing use of this Website.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">9. Assignment</h3>
          <p>
            TenderHub shall be permitted to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification or consent required. However, you shall not be permitted to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">10. Entire Agreement</h3>
          <p>
            These Terms, including any legal notices and disclaimers contained on this Website, constitute the entire agreement between TenderHub and you in relation to your use of this Website, and supersede all prior agreements and understandings with respect to the same.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-2">11. Governing Law & Jurisdiction</h3>
          <p>
            These Terms will be governed by and construed in accordance with the laws of [Your Country/State], and you submit to the non-exclusive jurisdiction of the state and federal courts located in [Your Country/State] for the resolution of any disputes.
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
