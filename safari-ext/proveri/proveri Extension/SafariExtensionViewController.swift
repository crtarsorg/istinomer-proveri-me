//
//  SafariExtensionViewController.swift
//  proveri Extension
//
//  Created by dini on 6/26/19.
//  Copyright © 2019 team. All rights reserved.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
