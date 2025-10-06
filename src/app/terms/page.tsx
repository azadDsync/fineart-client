import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            By accessing and using the FineArt Club platform, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Use License</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Permission is granted to temporarily access the materials (information or software) on FineArt Club's platform for personal, non-commercial transitory viewing only.
          </p>
          <p className="text-muted-foreground">
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the platform</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. User Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">
            When you create an account with us, you must provide accurate, complete, and up-to-date information. Failure to do so constitutes a breach of the Terms.
          </p>
          <p className="text-muted-foreground">
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Content Ownership</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">
            All artwork, paintings, and creative content uploaded by users remain the intellectual property of the respective creators.
          </p>
          <p className="text-muted-foreground">
            By uploading content to FineArt Club, you grant us a non-exclusive license to display, distribute, and promote your work within the platform.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. Prohibited Uses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">
            You may not use the platform:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Events and Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">
            FineArt Club organizes various events, workshops, and exhibitions. Registration for these events is subject to availability and may have additional terms.
          </p>
          <p className="text-muted-foreground">
            We reserve the right to cancel or modify events at any time. Participants will be notified of any significant changes.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your use of the platform is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>8. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            In no event shall FineArt Club or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the platform.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>9. Changes to Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We reserve the right to modify these terms at any time. We will notify users of any significant changes. Your continued use of the platform following the posting of changes constitutes acceptance of those changes.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>10. Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            If you have any questions about these Terms, please contact us through the platform's contact form or email us at support@fineartclub.com.
          </p>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground mt-8 pt-8 border-t">
        <p>Last updated: October 7, 2025</p>
      </div>
    </div>
  );
}
