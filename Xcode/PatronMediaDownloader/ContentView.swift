//
//  ContentView.swift
//  PatronMediaDownloader
//
//  Created by Jaehong Kang on 2/7/24.
//

import SwiftUI
import WebKit
#if os(macOS)
import SafariServices
import Cocoa
#endif

struct ContentView: View {
    #if os(macOS)
    static var extensionBundleIdentifier: String {
        class `_` {}

        return [Bundle(for: `_`.self).bundleIdentifier, "WebExtension"]
            .compactMap { $0 }
            .joined(separator: ".")
    }

    @State var isSafariExtensionEnabled: Bool?
    #endif

    var body: some View {
        VStack {
            Image("Icon", label: Text("Icon"))
                .resizable()
                .frame(width: 128, height: 128)

            #if os(iOS)
            Text("You can turn on PatronMediaDownloader’s Safari extension in Settings.")
            #else
            switch isSafariExtensionEnabled {
            case nil:
                Text("You can turn on PatronMediaDownloader’s extension in Safari Extensions preferences.")
            case true?:
                Text("PatronMediaDownloader’s extension is currently on. You can turn it off in Safari Extensions preferences.")
            case false?:
                Text("PatronMediaDownloader’s extension is currently off. You can turn it on in Safari Extensions preferences.")
            }

            if #available(macOS 13, *) {
                Button("Quit and Open Safari Extensions Preferences…") {
                    Task {
                        try? await SFSafariApplication.showPreferencesForExtension(withIdentifier: Self.extensionBundleIdentifier)

                        NSApp.terminate(nil)
                    }
                }
            }
            #endif
        }
        .padding()
        #if os(macOS)
        .task {
            let state = try? await SFSafariExtensionManager.stateOfSafariExtension(withIdentifier: Self.extensionBundleIdentifier)

            self.isSafariExtensionEnabled = state?.isEnabled
        }
        #endif
    }
}

#Preview {
    ContentView()
}
