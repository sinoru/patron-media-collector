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
    @inlinable
    static var bundle: Bundle {
        class `_` {}

        return Bundle(for: `_`.self)
    }

    @inlinable
    static var bundleName: String {
        let infoDictionaryKey = kCFBundleNameKey as String

        return 
            (Self.bundle.localizedInfoDictionary?[infoDictionaryKey] as? String) ??
            (Self.bundle.object(forInfoDictionaryKey: infoDictionaryKey) as? String) ??
            ""
    }

    #if os(macOS)
    static var extensionBundleIdentifier: String {
        [Self.bundle.bundleIdentifier, "WebExtension"]
            .compactMap { $0 }
            .joined(separator: ".")
    }

    static var safariPreferencesForExtensionTitle: String {
        if #available(macOS 13, *) {
            "the Extensions section of Safari Settings"
        } else {
            "Safari Extensions preferences"
        }
    }

    static var showSafariPreferencesForExtensionTitle: LocalizedStringKey {
        if #available(macOS 13, *) {
            "Quit and Open Safari Settings…"
        } else {
            "Quit and Open Safari Extensions Preferences…"
        }
    }

    @State var isSafariExtensionEnabled: Bool?
    #endif

    var body: some View {
        VStack(alignment: .center) {
            Image(.icon)
                .resizable()
                .frame(width: 128, height: 128)

            #if os(macOS)
            switch isSafariExtensionEnabled {
            case .none:
                Text("You can turn on \(Self.bundleName)’s extension in \(Self.safariPreferencesForExtensionTitle).")
            case .some(let isSafariExtensionEnabled):
                Text("\(Self.bundleName)’s extension is currently \(isSafariExtensionEnabled ? "on" : "off").")
                Text("You can turn it \(isSafariExtensionEnabled ? "off" : "on") in \(Self.safariPreferencesForExtensionTitle).")
            }

            Button(Self.showSafariPreferencesForExtensionTitle) {
                Task {
                    try? await SFSafariApplication.showPreferencesForExtension(withIdentifier: Self.extensionBundleIdentifier)

                    NSApp.terminate(nil)
                }
            }

            #else
            Text("You can turn on \(Self.bundleName)’s Safari extension in Settings.")
            #endif
        }
        .padding()
        #if os(macOS)
        .task(priority: .high) {
            let state = try? await SFSafariExtensionManager.stateOfSafariExtension(withIdentifier: Self.extensionBundleIdentifier)

            self.isSafariExtensionEnabled = state?.isEnabled
        }
        #endif
    }
}

#Preview {
    ContentView()
}
