//
//  SafariWebExtensionHandler.swift
//  PatronMediaCollector Extension
//
//  Created by Jaehong Kang on 2/7/24.
//

import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        let message: Any?
        if #available(iOS 17.0, macOS 14.0, *) {
            message = request?.userInfo?[SFExtensionMessageKey]
        } else {
            message = request?.userInfo?["message"]
        }

        #if DEBUG
        let profile: UUID?
        if #available(iOS 17.0, macOS 14.0, macCatalyst 17.1, *) {
            profile = request?.userInfo?[SFExtensionProfileKey] as? UUID
        } else {
            profile = request?.userInfo?["profile"] as? UUID
        }

        os_log(.default, "Received message from browser.runtime.sendNativeMessage: %@ (profile: %@)", String(describing: message), profile?.uuidString ?? "none")
        #endif

        let response = NSExtensionItem()
        if #available(iOS 17.0, macOS 14.0, *) {
            response.userInfo = [ SFExtensionMessageKey: message as Any ]
        } else {
            response.userInfo = [ "message": message as Any ]
        }
        context.completeRequest(returningItems: [response])
    }
}
