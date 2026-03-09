<?php
/**
 * CNC Checklist Form Submission
 * 
 * This script processes form data, generates a temporary PDF report,
 * and sends it as an email attachment using WordPress wp_mail().
 */

// (1) WordPress Integration
require_once($_SERVER['DOCUMENT_ROOT'] . '/blog/wp-load.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method Not Allowed";
    exit;
}

/**
 * Utility function to sanitize input
 */
function clean_input($data)
{
    return htmlspecialchars(strip_tags(trim($data)));
}

// Collect basic user info
$name = clean_input($_POST['name'] ?? '');
$email = $_POST['email'] ?? '';
$phone = clean_input($_POST['phone'] ?? '');
$country = clean_input($_POST['country'] ?? '');
$message = clean_input($_POST['message'] ?? '');

// (2) Email Validation
$sanitized_email = sanitize_email($email);

if (empty($name) || empty($sanitized_email) || empty($phone) || empty($country)) {
    http_response_code(400);
    echo "Required fields missing";
    exit;
}

if (!is_email($sanitized_email)) {
    http_response_code(400);
    echo "Invalid email format";
    exit;
}

// (3) PDF Handling (Received from Frontend)
$temp_dir = sys_get_temp_dir();
$filename = 'cnc_checklist_' . time() . '_' . uniqid() . '.pdf';
$file_path = $temp_dir . DIRECTORY_SEPARATOR . $filename;

// Check if a PDF file was uploaded from the frontend
if (isset($_FILES['pdf_file']) && $_FILES['pdf_file']['error'] === UPLOAD_ERR_OK) {
    if (!move_uploaded_file($_FILES['pdf_file']['tmp_name'], $file_path)) {
        http_response_code(500);
        echo "ERROR: Failed to save the uploaded PDF.";
        exit;
    }
} else {
    // Fallback if no file uploaded
    http_response_code(400);
    echo "ERROR: No PDF file received from the frontend.";
    exit;
}

if (!file_exists($file_path)) {
    http_response_code(500);
    echo "ERROR: PDF file path is invalid.";
    exit;
}


// (4) Email Sending with Attachment
$to = $sanitized_email;
$admin_to = "tos.webdevuser02@gmail.com"; // Admin notification
$subject = "Your CNC Design Verification Report - Tesla Mechanical Designs";

// Email Body
$email_body = "Hi $name,\n\n";
$email_body .= "Thank you for using our CNC Design Verification Tool. Please find your generated checklist report attached to this email.\n\n";
$email_body .= "Best Regards,\nTesla Mechanical Designs Team";

// Headers
$headers = array('Content-Type: text/plain; charset=UTF-8');
$headers[] = 'From: Tesla Mechanical Designs <info@teslamechanicaldesigns.com>';
$headers[] = 'Reply-To: ' . $admin_to;

// Attachments
$attachments = array($file_path);

// Use wp_mail() for SMTP compatibility
$mail_sent = wp_mail($to, $subject, $email_body, $headers, $attachments);

// (5) Cleanup
if (file_exists($file_path)) {
    unlink($file_path);
}

// (6) Response/Error Handling
if ($mail_sent) {
    // Notify admin with full details
    $admin_subject = "New CNC Report Sent: $name";
    $admin_body = "A new CNC Design Verification report has been sent.\n\n";
    $admin_body .= "User Details:\n";
    $admin_body .= "Name: $name\n";
    $admin_body .= "Email: $sanitized_email\n";
    $admin_body .= "Phone: $phone\n";
    $admin_body .= "Country: $country\n";
    $admin_body .= "Message: $message\n\n";
    $admin_body .= "Source: CNC Checklist Tool";

    wp_mail($admin_to, $admin_subject, $admin_body, $headers);

    echo "SUCCESS";
} else {
    http_response_code(500);
    error_log("wp_mail failed for $sanitized_email");
    echo "Mail sending failed. Please check server logs.";
}

exit;
?>