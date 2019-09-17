<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Facebook\Facebook;

class FacebookUser extends Controller
{
    public function store(){
        return view('loginfb');
    }

    public function storeCallback(){
        $fb = new Facebook([
            'app_id' => '362576554625481', // Replace {app-id} with your app id
            'app_secret' => '02f48a6e8485f1a2cf6e9a7c82af69ab',
            'default_graph_version' => 'v4.0',
            ]);
          
          $helper = $fb->getJavaScriptHelper();
          
          try {
            $accessToken = $helper->getAccessToken();
          } catch(Facebook\Exceptions\FacebookResponseException $e) {
            // When Graph returns an error
            return 'Graph returned an error: ' . $e->getMessage();
            exit;
          } catch(Facebook\Exceptions\FacebookSDKException $e) {
            // When validation fails or other local issues
            return 'Facebook SDK returned an error: ' . $e->getMessage();
            exit;
          }
          
          if (! isset($accessToken)) {
            return 'No cookie set or no OAuth data could be obtained from cookie.';
            exit;
          }
          
          // Logged in
          var_dump($accessToken->getValue());
          
          $_SESSION['fb_access_token'] = (string) $accessToken;

          return '<h3>Access Token</h3>';
    }
}
