<template>
    <el-dropdown-menu class="downMenu">
        <el-dropdown-item class="downItem" @click="downloadAsPDF">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px">
                <path
                    d="M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
            </svg>
            Export as PDF
        </el-dropdown-item>
        <el-dropdown-item class="downItem" @click="downloadAsPNG">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px">
                <path
                    d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
            </svg>
            Export as PNG
        </el-dropdown-item>
    </el-dropdown-menu>
</template>

<script setup>
    import html2canvas from "html2canvas";
    import { jsPDF } from "jspdf";
    import { toRefs } from "vue";
    import JSZip from "jszip";
    import { saveAs } from "file-saver";
    import { useRoute } from "vue-router";

    const route = useRoute();
    const props = defineProps({
        certificateRef: Object,
        nickname: Array || String,
        realName: Array,
        title: String,
        permission: Number,
    });

    const { certificateRef } = toRefs(props);


    async function captureCertificate() {
        const target = certificateRef.value?.$el || certificateRef.value;
        if (!target) return;

        // 获取所有证书页面
        const pages = target.querySelectorAll('.certificate-container');
        const canvases = [];

        // 为每个页面创建canvas 
        for (const page of pages) {
            const rawCanvas = await html2canvas(page, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff"
            });

            const A4_WIDTH = 3508;
            const A4_HEIGHT = 2480;

            const scale = Math.min(A4_WIDTH / rawCanvas.width, A4_HEIGHT / rawCanvas.height);
            const finalWidth = rawCanvas.width * scale;
            const finalHeight = rawCanvas.height * scale;

            const finalCanvas = document.createElement("canvas");
            finalCanvas.width = finalWidth;
            finalCanvas.height = finalHeight;
            const ctx = finalCanvas.getContext("2d");
            ctx.drawImage(rawCanvas, 0, 0, finalWidth, finalHeight);

            canvases.push(finalCanvas);
        }

        return canvases;
    }


    async function downloadAsPNG() {
        const canvases = await captureCertificate();
        if (!canvases) return;

        if (route.name === "Achievement" || props.permission === 0) {
            canvases.forEach((canvas, index) => {
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = `certificate-${props.nickname}.png`;
                link.click();
            });
        } else {
            const zip = new JSZip();

            canvases.forEach((canvas, index) => {
                const imgData = canvas.toDataURL("image/png");
                const base64Data = imgData.split(",")[1];
                zip.file(`${props.title}-${index+1}-${props.realName?.[index]?props.realName[index]:props.nickname?.[index]}.png`, base64Data, { base64: true });
            });

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${props.title}.zip`);
        }
    }


    async function downloadAsPDF() {
        const canvases = await captureCertificate();
        if (!canvases) return;

        if (route.name === "Achievement" || props.permission === 0) {
            const pdf = new jsPDF("l", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            canvases.forEach((canvas, index) => {
                if (index > 0) {
                    pdf.addPage();
                }
                const imgData = canvas.toDataURL("image/png");
                pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
            });
            pdf.save(`certificate-${props.nickname}.pdf`);
        } else {
            const zip = new JSZip();

            for (let i = 0; i < canvases.length; i++) {
                const pdf = new jsPDF("l", "mm", "a4");
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                const imgData = canvases[i].toDataURL("image/png");
                pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
                const pdfBlob = pdf.output("blob");
                zip.file(`${props.title}-${i+1}-${props.realName?.[i]?props.realName[i]:props.nickname?.[i]}.pdf`, pdfBlob);
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${props.title}.zip`);
        }
    }

</script>

<style>
    .downItem svg {
        fill: currentColor;
        padding-right: 5px;
    }

    .downItem {
        transition: all .3s ease;
    }
</style>
