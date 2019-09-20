using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System.IO;
using System.Diagnostics;
using System.Threading;

namespace cshape_tim_link_fb
{
    public partial class BrowserProfileBox : Form
    {
        ChromeOptions options;
        ChromeDriverService service;
        IWebDriver driver;
        IntPtr hwndWinBrowser;

        public BrowserProfileBox()
        {
            InitializeComponent();
        }


        private void BrowserProfileBox_Load(object sender, EventArgs e)
        {
            options = new ChromeOptions();
            options.AddArguments("--window-size=1024x768");
            options.AddArguments("user-data-dir=" + GetUserDataDir());
            service = ChromeDriverService.CreateDefaultService();
            service.HideCommandPromptWindow = true;
            driver = new ChromeDriver(service, options);

            hwndWinBrowser = GetHWND();
            Common.Win32.SetParent(hwndWinBrowser, this.Handle);
            panelWindowChrome_SizeChanged(null, null);
        }


        private void BrowserProfileBox_FormClosed(object sender, FormClosedEventArgs e)
        {
            driver?.Close();
            driver?.Quit();
            driver?.Dispose();
        }


        public object Javascript(string code, params object[] obj)
        {
            try
            {
                IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                return js.ExecuteScript(code, obj);
            }
            catch
            {
                return null;
            }
        }


        private IntPtr GetHWND()
        {
            try
            {
                Guid guid = Guid.NewGuid();
                driver.Navigate().GoToUrl("about:blank");
                Javascript($"document.title = '{guid.ToString()}';");
                Thread.Sleep(250);
                Process pid = Process.GetProcessesByName("chrome").First(p => p.MainWindowTitle.Contains(guid.ToString()));
                if (pid?.MainWindowHandle != null)
                    return pid.MainWindowHandle;
            }
            catch
            {
            }
            return new IntPtr();
        }


        public static string GetUserDataDir()
        {
            string path = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\\Google\\Chrome\\User Data";
            if (!Directory.Exists(path))
            {
                path = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\\Yuh\\DataChrome";
                if (!Directory.Exists(path))
                    MessageBox.Show("Không tìm thấy thư mục DataChrome, vì vậy bạn có thể cần đăng nhập lại fb ở đây");
            }
            return path;
        }

        private void panelWindowChrome_SizeChanged(object sender, EventArgs e)
        {
            Common.Win32.MoveWindow(hwndWinBrowser, panelWindowChrome.Location.X, panelWindowChrome.Location.Y, panelWindowChrome.Width, panelWindowChrome.Height, true);
        }
 
    }
}
